import React, { useState, FormEvent } from "react";
import api from "../../utils/api";
import Header from "../../layout/header";
import { Link } from "react-router-dom";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ Improved email validation: requires domain & TLD (e.g. .com, .in)
  const validateEmail = (email: string) => {
    const trimmed = email.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    return regex.test(trimmed);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const trimmedEmail = email.trim();

    // 🧠 validate BEFORE API call
    if (!validateEmail(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return; // ❌ stop here, don’t call API
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", { email: trimmedEmail });
      setSuccess(res.data.message);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError("This email address is not registered.");
      } else {
        setError(
          err.response?.data?.message ||
            "Something went wrong. Please try again later."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <form onSubmit={handleSubmit} className="auth-form">
        <h1>Forgot Password</h1>

        <ul>
          <li>
            <label className="field">
              <div className="input-with-icon">
                <span className="icon-box" aria-hidden>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 8.5l9 5.5 9-5.5"
                      stroke="#6b7280"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <rect
                      x="3"
                      y="5"
                      width="18"
                      height="14"
                      rx="2"
                      stroke="#6b7280"
                      strokeWidth="1.5"
                    />
                  </svg>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email ID"
                  required
                  autoComplete="off"
                />
              </div>

              {/* inline helper text below input */}
              {error && <div className="helper" style={{ color: "red" }}>{error}</div>}
              {success && <div className="helper" style={{ color: "green" }}>{success}</div>}
            </label>
          </li>

          <li>
            <Link to="/auth/login">Back to login</Link>
          </li>
        </ul>

        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Password"}
        </button>
      </form>
    </>
  );
};

export default ForgotPassword;
