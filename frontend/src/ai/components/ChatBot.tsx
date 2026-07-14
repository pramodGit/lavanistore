import { memo } from "react";

import { useChat } from "../hooks/useChat";

import ChatHeader from "./ChatHeader";
import ChatBody from "./ChatBody";
import ChatInput from "./ChatInput";

interface Props {

  onClose: () => void;

}

function ChatBot({

  onClose,

}: Props) {

  const {

    messages,

    loading,

    send,

    clearConversation,

  } = useChat();

  return (

    <>

      <ChatHeader
        onClose={onClose}
        onNewChat={clearConversation}
      />

      <ChatBody
        messages={messages}
        loading={loading}
      />

      <div className="ai-footer">

        <ChatInput
          onSend={send}
          loading={loading}
        />

      </div>

    </>

  );

}

export default memo(ChatBot);