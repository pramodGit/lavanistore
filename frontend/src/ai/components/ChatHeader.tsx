import { memo } from "react";

interface Props {
  onClose: () => void;
  onNewChat: () => void;
}

function ChatHeader({
  onClose,
  onNewChat,
}: Props) {

  return (

    <div className="ai-header">

      <div className="ai-header-left">

        <img
          src="/ai/robot.png"
          alt="AI"
          className="ai-header-avatar"
        />

        <div>

          <div className="ai-header-title">
            Lavani AI
          </div>

          <div className="ai-header-subtitle">
            Your smart shopping assistant
          </div>

        </div>

      </div>

      <div className="ai-header-actions">

        <button
          className="ai-header-btn new"
          onClick={onNewChat}
          title="New Chat"
        >
          ＋
        </button>
        |
        <button
          className="ai-header-btn"
          onClick={onClose}
          title="Close"
        >
          ✕
        </button>

      </div>

    </div>

  );

}

export default memo(ChatHeader);