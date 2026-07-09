import type { ChatMessage as Message } from "../types/chat";

interface Props {
  message: Message;
}

export default function ChatMessage({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: 12,
      }}
    >
      <div
        style={{
          padding: "10px 14px",
          borderRadius: 10,
          maxWidth: "70%",
          background: isUser ? "#1976d2" : "#f3f3f3",
          color: isUser ? "#fff" : "#000",
          whiteSpace: "pre-wrap",
        }}
      >
        {message.text}
      </div>
    </div>
  );
}