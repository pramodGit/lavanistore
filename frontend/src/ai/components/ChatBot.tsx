import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import { useChat } from "../hooks/useChat";

export default function ChatBot() {
  const {
    messages,
    loading,
    send,
  } = useChat();

  return (
    <div
      style={{
        width: 700,
        margin: "30px auto",
        border: "1px solid #ddd",
        borderRadius: 8,
        display: "flex",
        flexDirection: "column",
        height: "80vh",
      }}
    >
      <div
        style={{
          padding: 16,
          borderBottom: "1px solid #ddd",
          fontWeight: "bold",
        }}
      >
        Lavani AI Assistant
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 16,
        }}
      >
        {messages.map((m) => (
          <ChatMessage
            key={m.id}
            message={m}
          />
        ))}
      </div>

      <ChatInput
        onSend={send}
        loading={loading}
      />
    </div>
  );
}