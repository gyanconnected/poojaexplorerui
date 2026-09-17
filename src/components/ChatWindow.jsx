import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble.jsx";

export default function ChatWindow({ messages, isSending }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isSending]);

  if (messages.length === 0 && !isSending) {
    return (
      <div className="chat-window">
        <div className="empty-state">
          <h2>What would you like to know about Pooja?</h2>
          <p>
            Ask about Pooja Bharti, her journey, interests, experiences, or anything you’d like to discover.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      {messages.map((m) => (
        <MessageBubble key={m.id} role={m.role} text={m.text} isError={m.isError} />
      ))}
      {isSending && (
        <div className="typing-row">
          <div className="avatar" aria-hidden="true" style={{ background: "var(--moss)", color: "#fff" }}>
            P
          </div>
          <div className="typing-dots" aria-label="Guide is typing">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
