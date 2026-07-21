import { memo, useEffect, useRef } from "react";

import type { ChatMessage as ChatMessageType } from "../types/chat";

import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import WelcomeScreen from "./WelcomeScreen";

interface Props {
  messages: ChatMessageType[];
  loading: boolean;
  onSuggestionClick: (text: string) => void;
}

function ChatBody({
  messages,
  loading,
  onSuggestionClick,
}: Props) {

  const bottomRef = useRef<HTMLDivElement>(null);
  const firstLoad = useRef(true);

  useEffect(() => {

    bottomRef.current?.scrollIntoView({
      behavior: firstLoad.current ? "auto" : "smooth",
    });

    firstLoad.current = false;

  }, [messages, loading]);

  // Show welcome screen for a new conversation
  if (!messages.length && !loading) {
    return (
      <div className="ai-body">
        <WelcomeScreen
          onSuggestionClick={onSuggestionClick}
        />
      </div>
    );
  }

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