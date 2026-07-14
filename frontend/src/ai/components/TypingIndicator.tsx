import { memo } from "react";

export default memo(function TypingIndicator() {
  return (
    <div className="ai-message ai-assistant">
      <div className="ai-typing">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
});