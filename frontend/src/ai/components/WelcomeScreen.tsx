import { JSX, memo } from "react";
import {
  Package,
  ClipboardList,
  Truck,
  BriefcaseBusiness,
  ReceiptText,
  PackageSearch,
  Undo2,
  Users,
  Sparkles,
} from "lucide-react";

interface Props {
  onSuggestionClick: (text: string) => void;
}

export default memo(function WelcomeScreen({
  onSuggestionClick,
}: Props) {

  const suggestions: { text: string; icon: JSX.Element }[] = [
    {"text": "Show Order 24", "icon": <ReceiptText size={18} strokeWidth={2} />},
    {"text": "Protein Products", "icon": <PackageSearch  size={18} strokeWidth={2} />},
    {"text": "Return Policy", "icon": <Undo2 size={18} strokeWidth={2} />},
    {"text": "Become Distributor", "icon": <Users size={18} strokeWidth={2} />}
  ];

  return (
    <div className="ai-welcome">

      <div className="ai-hero">

        <img
          src="/ai/robot.png"
          alt="Lavani AI"
          className="ai-hero-avatar"
        />

        <h1>
          Welcome to <span>Lavani AI</span>
        </h1>

        <p>
          Hi! I'm here to help you with anything about Lavani Wellness.
        </p>

        <p className="ai-subtitle">
          How can I assist you today?
        </p>

      </div>

      <div className="ai-divider">
        <span>✨ I can help you with</span>
      </div>

      <div className="ai-feature-grid">

        <div className="ai-feature-card">
          <div className="ai-feature-icon product"><Package size={28} strokeWidth={2} /></div>
          <h3>Product Information</h3>
          <p>Find details about our products</p>
        </div>

        <div className="ai-feature-card">
          <div className="ai-feature-icon order"><ClipboardList size={28} strokeWidth={2} /></div>
          <h3>Order Status</h3>
          <p>Track your orders and delivery</p>
        </div>

        <div className="ai-feature-card">
          <div className="ai-feature-icon shipping"><Truck size={28} strokeWidth={2} /></div>
          <h3>Shipping & Returns</h3>
          <p>Shipping info and return policy</p>
        </div>

        <div className="ai-feature-card">
          <div className="ai-feature-icon business"><BriefcaseBusiness size={28} strokeWidth={2} /></div>
          <h3>Business Opportunity</h3>
          <p>Become a Lavani distributor</p>
        </div>

      </div>

      <div className="ai-divider">
        <span><Sparkles size={18} strokeWidth={2} color="#3b82f6" /> Try asking</span>
      </div>

      <div className="ai-suggestions">

        {suggestions.map((obj) => (

          <button
            key={obj.text}
            className="ai-suggestion-btn"
            onClick={() => onSuggestionClick(obj.text)}
          >
            {obj.icon}
            {obj.text}
          </button>

        ))}

      </div>

    </div>
  );

});