// frontend/src/ai/components/ChatMessage.tsx

import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import type { ChatMessage as Message } from "../types/chat";

interface Props {
  message: Message;
}

function ChatMessage({ message }: Props) {

  const isUser = message.role === "user";

  return (
    <div
      className={`ai-message ${
        isUser ? "ai-user" : "ai-assistant"
      }`}
    >
      <div className="ai-bubble">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {message.text}
        </ReactMarkdown>
      </div>
    </div>
  );
}

export default memo(ChatMessage);