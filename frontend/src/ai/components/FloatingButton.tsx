// frontend/src/ai/components/FloatingButton.tsx

import { memo } from "react";

interface Props {

    open: boolean;

    onClick: () => void;

}

function FloatingButton({

    open,

    onClick,

}: Props) {

    return (

        <button

            className="ai-floating-button"
            onClick={onClick}            

        >

            {open ? "✕" : "🤖"}

        </button>

    );

}

export default memo(FloatingButton);