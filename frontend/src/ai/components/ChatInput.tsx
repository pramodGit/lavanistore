import { memo, useRef, useState } from "react";
import { Paperclip, SendHorizontal } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  loading: boolean;
}

function ChatInput({
  onSend,
  loading,
}: ChatInputProps) {

  const [text, setText] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  };

  const handleSend = () => {
    const message = text.trim();

    if (!message || loading) return;

    onSend(message);
    setText("");

    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "52px";
      }
    });
  };

  return (
    <div className="ai-footer">

      <div className="ai-input-row">

        <button className="ai-attach-btn">
          <Paperclip size={20} />
        </button>

        <textarea
          ref={textareaRef}
          className="ai-input"
          rows={1}
          placeholder="Ask Lavani AI..."
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            autoResize();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        <button
          className="ai-send-button"
          onClick={handleSend}
          disabled={loading}
        >
          <SendHorizontal size={20} />
        </button>

      </div>

    </div>
  );
}

export default memo(ChatInput);