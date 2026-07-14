// frontend/src/ai/components/ChatHeader.tsx

import { memo } from "react";
import CloseIcon from "@mui/icons-material/Close";
import AddCommentIcon from "@mui/icons-material/AddComment";
import IconButton from "@mui/material/IconButton";

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

      <strong>🤖 Lavani AI</strong>

      <div className="ai-header-actions">

        {/* <button
          className="ai-header-btn"
          onClick={onNewChat}
          title="Start New Chat"
        >
          🗑️
        </button>

        <button
          className="ai-header-btn"
          onClick={onClose}
          title="Close"
        >
          ✕
        </button> */}
        <IconButton
            size="small"
            onClick={onNewChat}
            title="New Chat"
        >
            <AddCommentIcon />
        </IconButton>

        <IconButton
            size="small"
            onClick={onClose}
            title="Close"
        >
            <CloseIcon />
        </IconButton>

      </div>

    </div>
  );
}

export default memo(ChatHeader);