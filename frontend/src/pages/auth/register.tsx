import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";

// 🔹 NEW: for referral autofill from URL
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

import api from "../../utils/api";
import Footer from "../../layout/footer";
import Header from "../../layout/header";

interface FormData {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  password: string;
  mobile: string;
  role: "User";
  // role: "User" | "Admin";
  sponsorId: string;
}

const Register: React.FC = () => {
  const [form, setForm] = useState<FormData>({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    mobile: "",
    role: "User",
    sponsorId: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwordValid, setPasswordValid] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [sponsorName, setSponsorName] = useState<string | null>(null);
  const [sponsorError, setSponsorError] = useState<string | null>(null);
  const [checkingSponsor, setCheckingSponsor] = useState<boolean>(false);

  const navigate = useNavigate();

    // 🔹 NEW: read referral code from URL (?referral=XXXX)
  const [searchParams] = useSearchParams();
  const referralFromUrl = searchParams.get("referral");

    // ======================================================
  // 🔹 NEW: Auto-fill Sponsor ID from referral URL
  // Example: /auth/register?referral=ABCDEFGH
  // ======================================================
  useEffect(() => {
    if (referralFromUrl && referralFromUrl.length === 8) {
      setForm((prev) => ({
        ...prev,
        sponsorId: referralFromUrl,
      }));
    }
  }, [referralFromUrl]);



  // Validate password
  const validatePassword = (password: string) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/;
    return regex.test(password);
  };

  // Generic input change handler
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Live password validation
    if (name === "password") {
      setPasswordValid(validatePassword(value));
    }

    setForm((prev) => {
      const newForm = { ...prev, [name]: value };

      // Handle role selection
      if (name === "role") {
        if (value === "Admin") {
          newForm.sponsorId = "LW000001"; // auto-fill for Admin
          setSponsorName("Default Sponsor");
          setSponsorError(null);
        } else {
          newForm.sponsorId = ""; // clear for User
          setSponsorName(null);
          setSponsorError(null);
        }
      }

      return newForm;
    });

    // Reset sponsor state if input is cleared
    if (name === "sponsorId") {
      setSponsorName(null);
      setSponsorError(null);
    }
  };

  // Verify Sponsor ID on blur
  const verifySponsorId = async () => {
    const id = form.sponsorId.trim();

    if (form.role === "User") {
      if (id.length < 8) {
        setSponsorError("Sponsor ID must be exactly 8 characters.");
        setSponsorName(null);
        return false;
      } else if (id.length > 8) {
        setSponsorError("Sponsor ID cannot exceed 8 characters.");
        setSponsorName(null);
        return false;
      }

      setCheckingSponsor(true);
      setSponsorError(null);
      setSponsorName(null);

      try {
        const res = await api.get(`/auth/verify-sponsor/${id}`);
        const name =
          res.data.name ||
          (res.data.firstName && res.data.lastName
            ? `${res.data.firstName} ${res.data.lastName}`
            : res.data.fullName || null);

        if (name) {
          // ✅ Show full name even if IsGreen = 0
          setSponsorName(name);
          // Check green status
          if (res.data.isGreen === 0) {
            setSponsorError(`${name} - can't be a sponsor`);
            return false;
          }

          setSponsorError(null);
          return true;
        }
        else {
          setSponsorName(null);
          setSponsorError("Sponsor exists but name not returned by API.");
          return false;
        }
      } catch (err: any) {
        if (err?.response?.status === 404) {
          setSponsorName(null);
          setSponsorError("Sponsor ID doesn't exist.");
        } else {
          setSponsorName(null);
          setSponsorError("Error verifying sponsor. Please try again.");
        }
        return false;
      } finally {
        setCheckingSponsor(false);
      }
    }
    return true; // Admin bypass
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validatePassword(form.password)) {
      setPasswordValid(false);
      setError("Password does not meet requirements.");
      return;
    }

    // Verify sponsor before submitting
    const sponsorValid = await verifySponsorId();
    if (!sponsorValid) return;

    try {
      setError(null);
      setSuccess(null);
      await api.post("/auth/register", form);
      setSuccess("User registered successfully!");
      // navigate("/auth/login"); // uncomment if you want redirect
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.message || "Server error");
      } else if (err.request) {
        setError("No response from server");
      } else {
        setError(err.message);
      }
      setSuccess(null);
    }
  };

  return (
    <>
      <Header />
      <form onSubmit={handleSubmit} className="auth-form">
        <h1>Create Account</h1>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <ul>
          {/* Role selection temporarily hidden */}
          {/* <li>
            <label className="field">
              <div className="input-with-icon">
                <select name="role" value={form.role} onChange={handleChange}>
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </label>
          </li> */}

          {/* Sponsor ID */}
          <li>
            <label className="field">
              <div className="input-with-icon">
                <span className="icon-box" aria-hidden>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="4" width="18" height="16" rx="2" stroke="#6b7280" strokeWidth="1.5" />
                    <path d="M7 8h6M7 12h6M7 16h3" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </span>
                <input
                  type="text"
                  name="sponsorId"
                  placeholder="Enter Sponsor ID (8 chars)"
                  value={form.sponsorId}
                  onChange={handleChange}
                  onBlur={verifySponsorId}
                  maxLength={8}
                  autoComplete="off"
                  // readOnly={form.role === "Admin"}
                  required={form.role === "User"}
                />
              </div>
              <div className="helper" aria-live="polite">
                {checkingSponsor && <span>Checking sponsor...</span>}
                {!checkingSponsor && sponsorName && !sponsorError && (
                  <span style={{ color: "green" }}>Sponsor: {sponsorName}</span>
                )}

                {!checkingSponsor && sponsorError && (
                  <span style={{ color: "red" }}>{sponsorError}</span>
                )}

              </div>
            </label>
          </li>

          {/* First Name */}
          <li>
            <label className="field">
              <div className="input-with-icon">
                <span className="icon-box" aria-hidden>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 12a4 4 0 100-8 4 4 0 000 8z" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M20.5 21a8.5 8.5 0 10-17 0" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <input type="text" name="firstName" placeholder="First Name" required value={form.firstName} onChange={handleChange} />
              </div>
            </label>
          </li>

          {/* Middle Name */}
          <li>
            <label className="field">
              <div className="input-with-icon">
                <span className="icon-box" aria-hidden>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 12a4 4 0 100-8 4 4 0 000 8z" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M20.5 21a8.5 8.5 0 10-17 0" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <input type="text" name="middleName" placeholder="Middle Name (Optional)" value={form.middleName || ""} onChange={handleChange} />
              </div>
            </label>
          </li>

          {/* Last Name */}
          <li>
            <label className="field">
              <div className="input-with-icon">
                <span className="icon-box" aria-hidden>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 12a4 4 0 100-8 4 4 0 000 8z" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M20.5 21a8.5 8.5 0 10-17 0" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <input type="text" name="lastName" placeholder="Last Name" required value={form.lastName} onChange={handleChange} />
              </div>
            </label>
          </li>

          {/* Mobile */}
          <li>
            <label className="field">
              <div className="input-with-icon">
                <span className="icon-box" aria-hidden>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.86 19.86 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.86 19.86 0 01-3.07-8.63A2 2 0 014.11 2h3a2 2 0 012 1.72c.2 1.43.59 2.83 1.16 4.16a2 2 0 01-.45 2.11L9.91 10.09a16 16 0 006 6l1.1-1.1a2 2 0 012.11-.45c1.33.57 2.73.96 4.16 1.16a2 2 0 011.72 2z" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <input type="tel" name="mobile" placeholder="Mobile Number" required value={form.mobile} onChange={handleChange} />
              </div>
            </label>
          </li>

          {/* Email */}
          <li>
            <label className="field">
              <div className="input-with-icon">
                <span className="icon-box" aria-hidden>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M3 8.5l9 5.5 9-5.5" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x="3" y="5" width="18" height="14" rx="2" stroke="#6b7280" strokeWidth="1.5" />
                  </svg>
                </span>
                <input type="email" name="email" placeholder="xxx@xxxxxx.com" required value={form.email} onChange={handleChange} />
              </div>
            </label>
          </li>

          {/* Password */}
          <li>
            <label className="field">
              <div className="input-with-icon">
                <span className="icon-box" aria-hidden>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="11" width="18" height="10" rx="2" stroke="#6b7280" strokeWidth="1.5" />
                    <path d="M7 11V8a5 5 0 0110 0v3" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <input type={showPassword ? "text" : "password"} name="password" placeholder="Create a password" autoComplete="new-password" required value={form.password} onChange={handleChange} />
                <button type="button" onClick={() => setShowPassword((v) => !v)} className="action-btn" aria-label={showPassword ? "Hide password" : "Show password"} title={showPassword ? "Hide" : "Show"}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {!passwordValid && form.password.length > 0 && (
                <div className="helper text-red">
                  Password must be 8-32 chars, include uppercase, lowercase, number, and special character.
                </div>
              )}
            </label>
          </li>
        </ul>

        <button type="submit">Register</button>
        <div className="helper">
          Have already an account? <Link to="/auth/login">Login here</Link>
        </div>
      </form>
      <Footer />
    </>
  );
};

export default Register;
