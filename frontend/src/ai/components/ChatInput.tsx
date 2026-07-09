import { useState } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  loading: boolean;
}

export default function ChatInput({
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
    <div
      style={{
        display: "flex",
        gap: 10,
        padding: 16,
        borderTop: "1px solid #ddd",
      }}
    >
      <input
        type="text"
        placeholder="Ask Lavani AI..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{
          flex: 1,
          padding: 12,
          fontSize: 16,
        }}
      />

      <button
        onClick={handleSend}
        disabled={loading}
      >
        {loading ? "Thinking..." : "Send"}
      </button>
    </div>
  );
}