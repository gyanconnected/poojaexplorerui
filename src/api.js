// Talks only to our own Azure Function ("/api/chat"). No Azure endpoint,
// key, or credential of any kind is ever referenced from browser code.

const CHAT_ENDPOINT =
  "https://pooja-nature-fa-dmdef4hkgzguf5am.westus3-01.azurewebsites.net/api/chat";
const REQUEST_TIMEOUT_MS = 30000;

export class ChatApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ChatApiError";
    this.status = status;
  }
}

export async function sendMessage(message, conversationId) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(CHAT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, conversationId: conversationId ?? null }),
      signal: controller.signal,
    });
  } catch (err) {
    if (err.name === "AbortError") {
      throw new ChatApiError("The request took too long. Please try again.", 0);
    }
    throw new ChatApiError("Could not reach the server. Check your connection.", 0);
  } finally {
    clearTimeout(timeout);
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    // response had no JSON body
  }

  if (!response.ok) {
    const friendly =
      response.status === 429
        ? "Too many messages sent too quickly. Please wait a moment."
        : data?.error || "Something went wrong. Please try again.";
    throw new ChatApiError(friendly, response.status);
  }

  return {
    reply: data.reply,
    conversationId: data.conversationId,
  };
}
