const express = require("express");
const mongoose = require("mongoose");
const userAuth = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const Conversation = require("../models/conversationSchema");
const Message = require("../models/messageSchema");
const Subscription = require("../models/subscriptionSchema");
const User = require("../models/userSchema");

const chatRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName photoUrl age gender bio skills role";

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const getParticipantKey = (userIdA, userIdB) => [userIdA.toString(), userIdB.toString()].sort().join(":");

const hasAcceptedConnection = async (userIdA, userIdB) => {
  const connection = await ConnectionRequest.findOne({
    $or: [
      { fromUserId: userIdA, toUserId: userIdB, status: "accepted" },
      { fromUserId: userIdB, toUserId: userIdA, status: "accepted" },
    ],
  }).select("_id");

  return Boolean(connection);
};

const hasActiveProAccess = async (userId) => {
  const latestSubscription = await Subscription.findOne({ user: userId })
    .sort({ createdAt: -1 })
    .select("status currentEnd");

  const now = new Date();
  const isActive =
    latestSubscription?.status === "active" &&
    (!latestSubscription.currentEnd || latestSubscription.currentEnd > now);

  if (!isActive) {
    await User.updateOne({ _id: userId, isPremium: true }, { $set: { isPremium: false } });
  }

  return isActive;
};

const requireChatAccess = async (req, res, next) => {
  try {
    const hasPro = await hasActiveProAccess(req.user._id);
    if (!hasPro) {
      return res.status(403).json({ error: "Pro membership is required to chat." });
    }

    return next();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const loadConversationForMember = async (conversationId, userId) => {
  return Conversation.findOne({ _id: conversationId, participants: userId });
};

chatRouter.post("/chat/conversations/:otherUserId", userAuth, requireChatAccess, async (req, res) => {
  try {
    const userId = req.user._id;
    const otherUserId = req.params.otherUserId;

    if (!isValidObjectId(otherUserId)) {
      return res.status(400).json({ error: "Invalid user id." });
    }

    if (userId.toString() === otherUserId) {
      return res.status(400).json({ error: "You cannot chat with yourself." });
    }

    const otherUser = await User.findById(otherUserId).select(USER_SAFE_DATA);
    if (!otherUser) {
      return res.status(404).json({ error: "The user you want to chat with does not exist." });
    }

    const connectionExists = await hasAcceptedConnection(userId, otherUserId);
    if (!connectionExists) {
      return res.status(403).json({ error: "You can chat only after the connection is accepted." });
    }

    const participantKey = getParticipantKey(userId, otherUserId);
    let conversation = await Conversation.findOne({ participantKey });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [userId, otherUserId],
        participantKey,
        status: "active",
      });
    } else if (conversation.status === "blocked") {
      return res.status(403).json({ error: "This conversation is blocked." });
    } else if (conversation.status === "archived") {
      conversation.status = "active";
      await conversation.save();
    }

    const populatedConversation = await Conversation.findById(conversation._id)
      .populate("participants", USER_SAFE_DATA)
      .populate("lastMessageSenderId", USER_SAFE_DATA);

    return res.json({
      message: "Conversation ready.",
      data: {
        conversation: populatedConversation,
        otherUser,
      },
    });
  } catch (err) {
    return res.status(400).json({ error: `Error creating conversation. ${err.message}` });
  }
});

chatRouter.get("/chat/conversations", userAuth, requireChatAccess, async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({
      participants: userId,
      status: { $ne: "blocked" },
    })
      .sort({ lastMessageAt: -1, updatedAt: -1 })
      .populate("participants", USER_SAFE_DATA)
      .populate("lastMessageSenderId", USER_SAFE_DATA);

    const data = conversations.map((conversation) => {
      const otherParticipant = conversation.participants.find(
        (participant) => participant._id.toString() !== userId.toString()
      );

      return {
        ...conversation.toObject(),
        otherParticipant,
      };
    });

    return res.json({
      message: "Conversations fetched successfully.",
      data,
    });
  } catch (err) {
    return res.status(400).json({ error: `Error fetching conversations. ${err.message}` });
  }
});

chatRouter.get("/chat/conversations/:conversationId/messages", userAuth, requireChatAccess, async (req, res) => {
  try {
    const userId = req.user._id;
    const { conversationId } = req.params;

    if (!isValidObjectId(conversationId)) {
      return res.status(400).json({ error: "Invalid conversation id." });
    }

    const conversation = await loadConversationForMember(conversationId, userId);
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found or access denied." });
    }

    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 50);
    const before = req.query.before ? new Date(req.query.before) : null;

    const query = { conversationId };
    if (before && !Number.isNaN(before.getTime())) {
      query.createdAt = { $lt: before };
    }

    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("senderId", USER_SAFE_DATA);

    return res.json({
      message: "Messages fetched successfully.",
      data: messages.reverse(),
    });
  } catch (err) {
    return res.status(400).json({ error: `Error fetching messages. ${err.message}` });
  }
});

chatRouter.post("/chat/conversations/:conversationId/messages", userAuth, requireChatAccess, async (req, res) => {
  try {
    const userId = req.user._id;
    const { conversationId } = req.params;
    const { text, clientMessageId } = req.body;

    if (!isValidObjectId(conversationId)) {
      return res.status(400).json({ error: "Invalid conversation id." });
    }

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Message text is required." });
    }

    if (!clientMessageId) {
      return res.status(400).json({ error: "clientMessageId is required." });
    }

    const conversation = await loadConversationForMember(conversationId, userId);
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found or access denied." });
    }

    if (conversation.status === "blocked") {
      return res.status(403).json({ error: "This conversation is blocked." });
    }

    const otherParticipant = conversation.participants.find(
      (participant) => participant.toString() !== userId.toString()
    );

    const connectionExists = await hasAcceptedConnection(userId, otherParticipant);
    if (!connectionExists) {
      return res.status(403).json({ error: "You can send messages only in accepted connections." });
    }

    const existingMessage = await Message.findOne({ conversationId, senderId: userId, clientMessageId });
    if (existingMessage) {
      const populatedExistingMessage = await Message.findById(existingMessage._id).populate("senderId", USER_SAFE_DATA);
      return res.json({
        message: "Message already exists.",
        data: populatedExistingMessage,
      });
    }

    const message = await Message.create({
      conversationId,
      senderId: userId,
      text: text.trim(),
      clientMessageId,
    });

    conversation.lastMessageAt = message.createdAt;
    conversation.lastMessagePreview = text.trim().slice(0, 200);
    conversation.lastMessageSenderId = userId;
    conversation.status = "active";
    await conversation.save();

    const populatedMessage = await Message.findById(message._id).populate("senderId", USER_SAFE_DATA);

    return res.status(201).json({
      message: "Message sent successfully.",
      data: populatedMessage,
    });
  } catch (err) {
    return res.status(400).json({ error: `Error sending message. ${err.message}` });
  }
});

chatRouter.patch("/chat/conversations/:conversationId/read", userAuth, requireChatAccess, async (req, res) => {
  try {
    const userId = req.user._id;
    const { conversationId } = req.params;

    if (!isValidObjectId(conversationId)) {
      return res.status(400).json({ error: "Invalid conversation id." });
    }

    const conversation = await loadConversationForMember(conversationId, userId);
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found or access denied." });
    }

    const now = new Date();
    const result = await Message.updateMany(
      {
        conversationId,
        senderId: { $ne: userId },
        "readBy.userId": { $ne: userId },
      },
      {
        $push: {
          readBy: {
            userId,
            readAt: now,
          },
        },
      }
    );

    return res.json({
      message: "Messages marked as read.",
      data: {
        matchedCount: result.matchedCount ?? result.n ?? 0,
        modifiedCount: result.modifiedCount ?? result.nModified ?? 0,
      },
    });
  } catch (err) {
    return res.status(400).json({ error: `Error marking messages as read. ${err.message}` });
  }
});

chatRouter.patch("/chat/conversations/:conversationId/read", userAuth, requireChatAccess, async (req, res) => {
  try {
    const userId = req.user._id;
    const { conversationId } = req.params;

    if (!isValidObjectId(conversationId)) {
      return res.status(400).json({ error: "Invalid conversation id." });
    }

    const conversation = await loadConversationForMember(conversationId, userId);
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found or access denied." });
    }

    const now = new Date();
    const result = await Message.updateMany(
      {
        conversationId,
        senderId: { $ne: userId },
        "readBy.userId": { $ne: userId },
      },
      {
        $push: {
          readBy: {
            userId,
            readAt: now,
          },
        },
      }
    );

    return res.json({
      message: "Messages marked as read.",
      data: {
        matchedCount: result.matchedCount ?? result.n ?? 0,
        modifiedCount: result.modifiedCount ?? result.nModified ?? 0,
      },
    });
  } catch (err) {
    return res.status(400).json({ error: `Error marking messages as read. ${err.message}` });
  }
});

module.exports = chatRouter;