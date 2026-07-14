import { memo, useEffect, useRef } from "react";

import type { ChatMessage as ChatMessageType } from "../types/chat";
import ChatMessage from "./ChatMessage";

import TypingIndicator from "./TypingIndicator";

interface Props {
  messages: ChatMessageType[];
  loading: boolean;
}

function ChatBody({ messages, loading }: Props) {

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {

    bottomRef.current?.scrollIntoView({

      behavior: "smooth",

    });

  }, [messages]);

  return (

    <div className="ai-body">

      {messages.map((message) => (

        <ChatMessage
          key={message.id}
          message={message}
        />

      ))}

      {loading && <TypingIndicator />}

      <div ref={bottomRef} />

    </div>

  );

}

export default memo(ChatBody);