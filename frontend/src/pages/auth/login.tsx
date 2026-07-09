import React, { useState, useContext, FormEvent, ChangeEvent, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Header from "../../layout/header";
import Footer from "../../layout/footer";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setUser } from "../../store/authSlice";
import { ApiError } from "../../utils/ApiError"; // ✅ import ApiError

const Login: React.FC = () => {
  const dispatch   = useAppDispatch();
  const [userName, setUserName]     = useState<string>("");
  const [password, setPassword]     = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Replace alert() with typed error state
  const [error, setError]           = useState<string | null>(null);
  // ✅ Prevent double submit
  const [submitting, setSubmitting] = useState(false);

  const { login }  = useContext(AuthContext);
  const navigate   = useNavigate();
  const location   = useLocation();
  const user       = useAppSelector((state) => state.auth.user);
  const from       = (location.state as any)?.from || "/product-list";

  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, navigate, from]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // ✅ Clear previous error on new attempt
    setError(null);
    setSubmitting(true);

    try {
      const loggedInUser = await login(userName, password);
      dispatch(setUser(loggedInUser));
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      navigate(from, { replace: true });

    } catch (err: unknown) {
      // ✅ Typed error handling — different message per case
      if (err instanceof ApiError) {
        if (err.statusCode === 401) {
          setError("Invalid username or password.");
        } else if (err.statusCode === 0) {
          setError("Network error. Please check your connection.");
        } else {
          setError(err.message || "Login failed. Please try again.");
        }
      } else {
        setError("Something went wrong. Please try again.");
      }
      console.error("Login error:", err);

    } finally {
      // ✅ Always reset — even if login throws
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <form onSubmit={handleSubmit} className="auth-form">
        <h1>Login</h1>

        {/* ✅ Inline error — replaces alert() */}
        {error && (
          <div className="message error" role="alert">
            {error}
          </div>
        )}

        <ul>
          {/* Username */}
          <li>
            <label className="field">
              <div className="input-with-icon">
                <span className="icon-box" aria-hidden>
                  {/* your existing SVG — unchanged */}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M12 12a4 4 0 100-8 4 4 0 000 8z" stroke="#6b7280"
                      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M20.5 21a8.5 8.5 0 10-17 0" stroke="#6b7280"
                      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <input
                  value={userName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setUserName(e.target.value);
                    setError(null); // ✅ clear error as user types
                  }}
                  required
                  type="text"
                  name="lavaniUserName"
                  placeholder="Username (e.g. LW565653)"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                  disabled={submitting} // ✅ disable while submitting
                />
              </div>
            </label>
          </li>

          {/* Password */}
          <li>
            <label className="field">
              <div className="input-with-icon">
                <span className="icon-box" aria-hidden>
                  {/* your existing SVG — unchanged */}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <rect x="3" y="11" width="18" height="10" rx="2"
                      stroke="#6b7280" strokeWidth="1.5"/>
                    <path d="M7 11V8a5 5 0 0110 0v3" stroke="#6b7280"
                      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setPassword(e.target.value);
                    setError(null); // ✅ clear error as user types
                  }}
                  required
                  disabled={submitting} // ✅ disable while submitting
                />
                {/* your existing show/hide button — unchanged */}
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="action-btn"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide" : "Show"}
                >
                  {showPassword ? (
                    // Eye-off SVG
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden
                    >
                      <path
                        d="M3 3l18 18"
                        stroke="#374151"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9.88 9.88A3 3 0 1114.12 14.12"
                        stroke="#374151"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10.7 5.94A10.94 10.94 0 013 12c1.5 3 4 5.5 9 6.5"
                        stroke="#374151"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M21 12c-1.5-3-4-5.5-9-6.5"
                        stroke="#374151"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    // Eye SVG
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden
                    >
                      <path
                        d="M2.5 12s3-6 9.5-6 9.5 6 9.5 6-3 6-9.5 6S2.5 12 2.5 12z"
                        stroke="#374151"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="#374151"
                        strokeWidth="1.5"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </label>
          </li>

          <li>
            <Link to="/auth/forgot-password">Forgot password?</Link>
          </li>
        </ul>

        {/* ✅ Button shows loading state — prevents double submit */}
        <button type="submit" disabled={submitting}>
          {submitting ? "Logging in..." : "Login"}
        </button>

        <div className="helper">
          Don't have an account? <Link to="/auth/register">Register</Link>
        </div>
      </form>
      <Footer />
    </>
  );
};

export default Login;