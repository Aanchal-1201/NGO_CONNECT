import { useState, useRef, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../../config";
import "./AIChat.css";

export default function AIChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "ai",
      text: "👋 Hi! I'm the NGO Connect AI assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  const role = userStr ? JSON.parse(userStr)?.role : "user";

  // Auto-scroll to latest message
  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { from: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${BASE_URL}/api/ai/chat`,
        { message: text, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages((prev) => [...prev, { from: "ai", text: res.data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { from: "ai", text: "⚠️ Sorry, I couldn't respond right now. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="ai-chat-root">
      {/* CHAT WINDOW */}
      {open && (
        <div className="ai-chat-window">
          {/* Header */}
          <div className="ai-chat-header">
            <div className="ai-chat-header-info">
              <div className="ai-avatar-dot" />
              <div>
                <p className="ai-chat-title">NGO Connect AI</p>
                <p className="ai-chat-status">● Online</p>
              </div>
            </div>
            <button className="ai-chat-close" onClick={() => setOpen(false)}>✕</button>
          </div>

          {/* Messages */}
          <div className="ai-chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`ai-msg-wrap ${msg.from === "user" ? "user-wrap" : "ai-wrap"}`}>
                {msg.from === "ai" && <div className="ai-icon">🤖</div>}
                <div className={`ai-bubble ${msg.from === "user" ? "user-bubble" : "ai-bubble-ai"}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="ai-msg-wrap ai-wrap">
                <div className="ai-icon">🤖</div>
                <div className="ai-bubble ai-bubble-ai ai-typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggested quick questions */}
          {messages.length === 1 && (
            <div className="ai-quick-questions">
              {["How do I raise a request?", "How do NGOs get notified?", "What is priority level?"].map((q) => (
                <button key={q} className="ai-quick-btn" onClick={() => { setInput(q); }}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="ai-chat-input-row">
            <input
              type="text"
              className="ai-chat-input"
              placeholder="Ask anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              disabled={loading}
            />
            <button
              className="ai-send-btn"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {/* FLOATING BUTTON */}
      <button className={`ai-fab ${open ? "ai-fab-open" : ""}`} onClick={() => setOpen(!open)}>
        {open ? "✕" : "💬"}
      </button>
    </div>
  );
}
