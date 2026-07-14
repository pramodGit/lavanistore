// frontend/src/ai/components/ChatWindow.tsx

import { memo } from "react";
import ChatBot from "./ChatBot";

interface Props {
    onClose: () => void;
}

function ChatWindow({
    onClose,
}: Props) {
    return (
        <div className="ai-chat-window">

            <ChatBot
                onClose={onClose}
            />

        </div>
    );
}

export default memo(ChatWindow);