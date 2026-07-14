// frontend/src/ai/components/ChatInput.tsx

import { useState } from "react";
import { memo } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  loading: boolean;
}

function ChatInput({
  onSend,
  loading,
}: ChatInputProps) {
  const [text, setText] = useState("");

  const handleSend = () => {
    const message = text.trim();

    if (!message || loading) return;

    onSend(message);
    setText("");
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="ai-input-row">
      <input
        type="text"
        placeholder="Ask Lavani AI..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        className="ai-input"
      />

      <button
        className="ai-send-button"
        onClick={handleSend}
        disabled={loading}
      >
        {loading ? "Thinking..." : "Send"}
      </button>
    </div>
  );
}

export default memo(ChatInput);