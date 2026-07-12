import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { ArrowLeft, Send, Circle } from "lucide-react";

const BASE_URL = import.meta.env.VITE_API_URL || "";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "";

async function api(path, options = {}) {
  const r = await fetch(`${BASE_URL}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const text = await r.text();
  if (!r.ok) throw new Error(text || `Request failed with status ${r.status}`);
  return text ? JSON.parse(text) : {};
}

async function apiPost(path, body) {
  const r = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await r.text();
  if (!r.ok) throw new Error(text || `Request failed with status ${r.status}`);
  return text ? JSON.parse(text) : {};
}

function ChatPage() {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const listRef = useRef(null);
  const typingTimerRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [conversationMeta, setConversationMeta] = useState(null);
  const [isOtherTyping, setIsOtherTyping] = useState(false);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        const [messagesRes, conversationsRes] = await Promise.all([
          api(`/chat/conversations/${conversationId}/messages?limit=50`),
          api(`/chat/conversations`),
        ]);

        if (!mounted) return;

        setMessages(messagesRes?.data || []);
        const foundConversation = (conversationsRes?.data || []).find((item) => item._id === conversationId);
        setConversationMeta(foundConversation || null);
        setError("");

        await api(`/chat/conversations/${conversationId}/read`, { method: "PATCH" });
      } catch (err) {
        if (!mounted) return;
        setError(err.message || "Failed to load chat.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    const socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });
    socketRef.current = socket;

    socket.on("connect_error", (err) => {
      if (mounted) setError(err.message || "Socket connection failed.");
    });

    socket.on("message:new", ({ conversationId: incomingConversationId, message }) => {
      if (incomingConversationId === conversationId) {
        setMessages((prev) => {
          const optimisticIndex = prev.findIndex(
            (m) => m.clientMessageId && m.clientMessageId === message.clientMessageId
          );
          if (optimisticIndex !== -1) {
            const next = [...prev];
            next[optimisticIndex] = message;
            return next;
          }

          if (prev.some((m) => m._id === message._id)) return prev;
          return [...prev, message];
        });
      }
    });

    socket.emit("conversation:join", { conversationId }, (response) => {
      if (response?.ok === false && mounted) {
        setError(response.error || "Failed to join conversation.");
      }
    });

    socket.on("message:read:update", () => {});

    socket.on("connect", () => {
      socket.emit("conversation:join", { conversationId }, () => {});
    });

    socket.on("typing:update", (payload) => {
      if (payload?.conversationId !== conversationId) return;
      setIsOtherTyping(Boolean(payload?.isTyping));
    });

    return () => {
      mounted = false;
      clearTimeout(typingTimerRef.current);
      socket.disconnect();
    };
  }, [conversationId]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const title = useMemo(() => {
    if (!conversationMeta) return "Chat";
    const other = conversationMeta.otherParticipant;
    return other ? `${other.firstName} ${other.lastName}` : "Chat";
  }, [conversationMeta]);

  const sendMessage = async () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setSending(true);
    setError("");
    const clientMessageId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    const optimisticMessage = {
      _id: clientMessageId,
      text: trimmed,
      clientMessageId,
      senderId: { _id: "me" },
      createdAt: new Date().toISOString(),
      optimistic: true,
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setText("");

    const socket = socketRef.current;

    const handleSuccess = (data) => {
      if (data?.data?._id) {
        setMessages((prev) =>
          prev.map((message) =>
            message.clientMessageId === data.data.clientMessageId || message._id === clientMessageId
              ? data.data
              : message
          )
        );
      }
    };

    try {
      if (socket?.connected) {
        socket.emit(
          "message:send",
          { conversationId, text: trimmed, clientMessageId },
          (response) => {
            if (response?.ok) {
              handleSuccess(response);
            } else {
              setError(response?.error || "Socket send failed.");
            }
            setSending(false);
          }
        );
        return;
      }

      const response = await apiPost(`/api/chat/conversations/${conversationId}/messages`, {
        text: trimmed,
        clientMessageId,
      });
      handleSuccess(response);
    } catch (err) {
      setError(err.message || "Failed to send message.");
      setMessages((prev) => prev.filter((message) => message._id !== clientMessageId));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white flex flex-col">
      <div className="px-4 py-3 border-b border-white/10 backdrop-blur bg-black/20 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-black text-lg truncate">{title}</h1>
          <p className="text-xs text-slate-400">Conversation ready</p>
          {isOtherTyping && <p className="text-xs text-emerald-400">Typing…</p>}
        </div>
        <Circle className="w-3 h-3 text-emerald-400 fill-emerald-400" />
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-slate-400">Loading chat…</div>
      ) : (
        <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-500 text-sm">
              No messages yet. Start the conversation.
            </div>
          ) : (
            messages.map((message) => {
              const mine = message.senderId?._id === "me" || message.senderId === undefined || message.optimistic;
              return (
                <div key={message._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${mine ? "bg-purple-600 text-white" : "bg-white/10 text-slate-100"}`}>
                    <p className="whitespace-pre-wrap">{message.text}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {error && <div className="px-4 pb-2 text-sm text-rose-300">{error}</div>}

      <div className="p-4 border-t border-white/10 bg-black/20 backdrop-blur">
        <div className="flex gap-3 items-end">
          <textarea
            value={text}
            onChange={(e) => {
              const nextValue = e.target.value;
              setText(nextValue);

              const socket = socketRef.current;
              if (socket?.connected) {
                socket.emit("typing:start", { conversationId });
                clearTimeout(typingTimerRef.current);
                typingTimerRef.current = setTimeout(() => {
                  socket.emit("typing:stop", { conversationId });
                }, 800);
              }
            }}
            rows={1}
            placeholder="Write a message..."
            className="flex-1 resize-none rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none focus:border-purple-500 min-h-[48px] max-h-32"
          />
          <button
            onClick={sendMessage}
            disabled={sending || !text.trim()}
            className="h-12 px-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;