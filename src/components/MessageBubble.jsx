export default function MessageBubble({ role, text, isError }) {
  const isUser = role === "user";
  return (
    <div className={`message-row ${isUser ? "user" : "assistant"}`}>
      <div className="avatar" aria-hidden="true">
        {isUser ? "You" : "P"}
      </div>
      <div className={`bubble ${isError ? "error" : ""}`}>{text}</div>
    </div>
  );
}
