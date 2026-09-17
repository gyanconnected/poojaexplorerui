import { useRef, useState } from "react";

const MAX_LENGTH = 2000;

export default function MessageInput({ onSend, disabled }) {
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);

  function handleChange(e) {
    setValue(e.target.value);
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
    }
  }

  function submit() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  return (
    <div className="input-bar">
      <div className="input-row">
        <textarea
          ref={textareaRef}
          rows={1}
          placeholder="Ask about Pooja…"
          value={value}
          maxLength={MAX_LENGTH}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-label="Message"
        />
        <button
          className="send-btn"
          onClick={submit}
          disabled={disabled || !value.trim()}
          aria-label="Send message"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 12L20 4L13 20L11 13L4 12Z" fill="currentColor" />
          </svg>
        </button>
      </div>
      <p className="input-hint">Enter to send, Shift + Enter for a new line</p>
    </div>
  );
}
