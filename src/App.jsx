import { useState } from "react";
import Header from "./components/Header.jsx";
import ChatWindow from "./components/ChatWindow.jsx";
import MessageInput from "./components/MessageInput.jsx";
import { sendMessage, ChatApiError } from "./api.js";

// Conversation id lives only in this browser tab's sessionStorage, so a
// refresh keeps context but closing the tab starts fresh. No message text
// is persisted client-side.
const STORAGE_KEY = "pooja-nature-explore:conversationId";

function loadConversationId() {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function saveConversationId(id) {
  try {
    if (id) sessionStorage.setItem(STORAGE_KEY, id);
    else sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // sessionStorage unavailable (private browsing etc) - conversation
    // simply won't survive a refresh, which is an acceptable fallback.
  }
}

let nextId = 1;

export default function App() {
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(loadConversationId);
  const [isSending, setIsSending] = useState(false);
  const [bannerError, setBannerError] = useState(null);

  async function handleSend(text) {
    setBannerError(null);
    setMessages((prev) => [...prev, { id: nextId++, role: "user", text }]);
    setIsSending(true);

    try {
      const result = await sendMessage(text, conversationId);
      setConversationId(result.conversationId);
      saveConversationId(result.conversationId);
      setMessages((prev) => [
        ...prev,
        { id: nextId++, role: "assistant", text: result.reply },
      ]);
    } catch (err) {
      const friendly =
        err instanceof ChatApiError ? err.message : "Something went wrong. Please try again.";
      setBannerError(friendly);
      setMessages((prev) => [
        ...prev,
        { id: nextId++, role: "assistant", text: friendly, isError: true },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  function handleNewChat() {
    setMessages([]);
    setConversationId(null);
    saveConversationId(null);
    setBannerError(null);
  }

  return (
    <div className="app-shell">
      <Header onNewChat={handleNewChat} hasMessages={messages.length > 0} />
      {bannerError && <div className="banner-error">{bannerError}</div>}
      <ChatWindow messages={messages} isSending={isSending} />
      <MessageInput onSend={handleSend} disabled={isSending} />
    </div>
  );
}
