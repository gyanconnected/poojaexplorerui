export default function Header({ onNewChat, hasMessages }) {
  return (
    <header className="app-header">
      <div className="brand">
        <div className="brand-mark" aria-hidden="true">
          P
        </div>
        <div>
          <h1>Pooja Nature Explore</h1>
          <p className="tagline">Discover Pooja Bharti through AI</p>
        </div>
      </div>
      <button className="new-chat-btn" onClick={onNewChat} disabled={!hasMessages}>
        New chat
      </button>
    </header>
  );
}
