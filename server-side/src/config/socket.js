const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const User = require("../models/userSchema");
const Conversation = require("../models/conversationSchema");
const ConnectionRequest = require("../models/connectionRequest");
const Message = require("../models/messageSchema");
const Subscription = require("../models/subscriptionSchema");
const attachRedisAdapter = require("./redis");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender bio skills role";

const hasActiveProAccess = async (userId) => {
  const latestSubscription = await Subscription.findOne({ user: userId })
    .sort({ createdAt: -1 })
    .select("status currentEnd");

  const now = new Date();
  return (
    latestSubscription?.status === "active" &&
    (!latestSubscription.currentEnd || latestSubscription.currentEnd > now)
  );
};

const hasAcceptedConnection = async (userIdA, userIdB) => {
  const connection = await ConnectionRequest.findOne({
    $or: [
      { fromUserId: userIdA, toUserId: userIdB, status: "accepted" },
      { fromUserId: userIdB, toUserId: userIdA, status: "accepted" },
    ],
  }).select("_id");

  return Boolean(connection);
};

const getParticipantKey = (userIdA, userIdB) => [userIdA.toString(), userIdB.toString()].sort().join(":");

const findConversationForUserPair = async (userIdA, userIdB) => {
  const participantKey = getParticipantKey(userIdA, userIdB);
  return Conversation.findOne({ participantKey });
};

const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  attachRedisAdapter(io).catch((err) => {
    console.error("Failed to enable Redis adapter, continuing in single-instance mode:", err.message);
  });

  io.use(async (socket, next) => {
    try {
      const rawCookie = socket.request.headers.cookie || "";
      const parsedCookie = cookie.parse(rawCookie);
      const token = parsedCookie.token || socket.handshake.auth?.token;

      if (!token) {
        return next(new Error("Authentication token missing"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded._id).select(USER_SAFE_DATA);

      if (!user) {
        return next(new Error("User not found"));
      }

      socket.user = user;
      return next();
    } catch (err) {
      return next(new Error("Socket authentication failed"));
    }
  });

  io.on("connection", async (socket) => {
    const userId = socket.user._id.toString();
    const personalRoom = `user:${userId}`;

    socket.join(personalRoom);
    socket.emit("connected", {
      message: "Socket connected successfully.",
      userId,
    });

    socket.on("conversation:join", async ({ conversationId }, ack) => {
      try {
        const conversation = await Conversation.findOne({
          _id: conversationId,
          participants: socket.user._id,
          status: { $ne: "blocked" },
        });

        if (!conversation) {
          if (typeof ack === "function") {
            return ack({ ok: false, error: "Conversation not found or access denied." });
          }
          return;
        }

        socket.join(`conversation:${conversationId}`);

        socket.emit("conversation:joined", {
          ok: true,
          conversationId,
        });

        if (typeof ack === "function") {
          return ack({ ok: true, conversationId });
        }
      } catch (err) {
        if (typeof ack === "function") {
          return ack({ ok: false, error: err.message });
        }
      }
    });

    socket.on("message:send", async (payload, ack) => {
      try {
        const { conversationId, text, clientMessageId } = payload || {};

        if (!conversationId || !text || !text.trim() || !clientMessageId) {
          return typeof ack === "function"
            ? ack({ ok: false, error: "conversationId, text, and clientMessageId are required." })
            : undefined;
        }

        const conversation = await Conversation.findOne({
          _id: conversationId,
          participants: socket.user._id,
          status: { $ne: "blocked" },
        });

        if (!conversation) {
          return typeof ack === "function"
            ? ack({ ok: false, error: "Conversation not found or access denied." })
            : undefined;
        }

        const hasPro = await hasActiveProAccess(socket.user._id);
        if (!hasPro) {
          return typeof ack === "function"
            ? ack({ ok: false, error: "Pro membership is required to chat." })
            : undefined;
        }

        const otherParticipant = conversation.participants.find(
          (participant) => participant.toString() !== socket.user._id.toString()
        );

        const connectionExists = await hasAcceptedConnection(socket.user._id, otherParticipant);
        if (!connectionExists) {
          return typeof ack === "function"
            ? ack({ ok: false, error: "You can chat only after the connection is accepted." })
            : undefined;
        }

        const existingMessage = await Message.findOne({ conversationId, senderId: socket.user._id, clientMessageId });
        if (existingMessage) {
          const populatedExistingMessage = await Message.findById(existingMessage._id).populate("senderId", USER_SAFE_DATA);
          return typeof ack === "function"
            ? ack({ ok: true, data: populatedExistingMessage, duplicate: true })
            : undefined;
        }

        const message = await Message.create({
          conversationId,
          senderId: socket.user._id,
          text: text.trim(),
          clientMessageId,
        });

        conversation.lastMessageAt = message.createdAt;
        conversation.lastMessagePreview = text.trim().slice(0, 200);
        conversation.lastMessageSenderId = socket.user._id;
        conversation.status = "active";
        await conversation.save();

        const populatedMessage = await Message.findById(message._id).populate("senderId", USER_SAFE_DATA);

        io.to(`conversation:${conversationId}`).emit("message:new", {
          conversationId,
          message: populatedMessage,
        });

        io.to(`user:${otherParticipant.toString()}`).emit("conversation:updated", {
          conversationId,
          lastMessageAt: conversation.lastMessageAt,
          lastMessagePreview: conversation.lastMessagePreview,
          lastMessageSenderId: socket.user,
        });

        if (typeof ack === "function") {
          return ack({ ok: true, data: populatedMessage });
        }
      } catch (err) {
        if (typeof ack === "function") {
          return ack({ ok: false, error: err.message });
        }
      }
    });

    socket.on("typing:start", async (payload) => {
      const { conversationId } = payload || {};
      if (!conversationId) return;

      const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: socket.user._id,
        status: { $ne: "blocked" },
      }).select("_id participants");

      if (!conversation) return;

      socket.to(`conversation:${conversationId}`).emit("typing:update", {
        conversationId,
        userId: socket.user._id,
        isTyping: true,
      });
    });

    socket.on("typing:stop", async (payload) => {
      const { conversationId } = payload || {};
      if (!conversationId) return;

      const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: socket.user._id,
        status: { $ne: "blocked" },
      }).select("_id participants");

      if (!conversation) return;

      socket.to(`conversation:${conversationId}`).emit("typing:update", {
        conversationId,
        userId: socket.user._id,
        isTyping: false,
      });
    });

    socket.on("message:read", async (payload, ack) => {
      try {
        const { conversationId } = payload || {};

        if (!conversationId) {
          return typeof ack === "function"
            ? ack({ ok: false, error: "conversationId is required." })
            : undefined;
        }

        const conversation = await Conversation.findOne({
          _id: conversationId,
          participants: socket.user._id,
        });

        if (!conversation) {
          return typeof ack === "function"
            ? ack({ ok: false, error: "Conversation not found or access denied." })
            : undefined;
        }

        const result = await Message.updateMany(
          {
            conversationId,
            senderId: { $ne: socket.user._id },
            "readBy.userId": { $ne: socket.user._id },
          },
          {
            $push: {
              readBy: {
                userId: socket.user._id,
                readAt: new Date(),
              },
            },
          }
        );

        socket.to(`conversation:${conversationId}`).emit("message:read:update", {
          conversationId,
          readerId: socket.user._id,
          modifiedCount: result.modifiedCount ?? result.nModified ?? 0,
        });

        if (typeof ack === "function") {
          return ack({ ok: true, modifiedCount: result.modifiedCount ?? result.nModified ?? 0 });
        }
      } catch (err) {
        if (typeof ack === "function") {
          return ack({ ok: false, error: err.message });
        }
      }
    });

    socket.on("disconnect", () => {
      socket.leave(personalRoom);
    });
  });

  return io;
};

module.exports = initSocket;