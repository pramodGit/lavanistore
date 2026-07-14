import { useState, useCallback } from "react";
import { useLocation } from "react-router-dom";

import ChatWindow from "./ChatWindow";
import FloatingButton from "./FloatingButton";

import "../styles/chat-widget.css";

const hiddenRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
];

export default function AIChatWidget() {

    const [open, setOpen] = useState(false);

    const toggleChat = useCallback(() => {
        setOpen(prev => !prev);
    }, []);

    const { pathname } = useLocation();

    if (hiddenRoutes.includes(pathname)) {
        return null;
    }

    return (
        <>

            <FloatingButton
                open={open}
                onClick={toggleChat}
            />

            {open && (
                <ChatWindow
                    onClose={toggleChat}
                />
            )}

        </>
    );

}