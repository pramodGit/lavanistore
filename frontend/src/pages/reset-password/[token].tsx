import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../utils/api";
import Header from '../../layout/header';

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post(`/auth/reset-password/${token}`, { password });
      setSuccess(res.data.message || "Password updated successfully!");
    } catch (err: any) {
      if (err.response) {
        // Server responded with error
        setError(err.response.data.message || "Failed to reset password");
      } else if (err.request) {
        // No response from server
        setError("No response from server. Please try again later.");
      } else {
        // Other unexpected errors
        setError("Unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="auth-form">
        <h1>Reset Password</h1>
        <ul>
            <li>{error && <p className="message error">{error}</p>}</li>
            <li>{success && <p className="message success">{success}</p>}</li>
            <li>
              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </li>
        </ul>
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </>
  );
}

export default ResetPassword;


