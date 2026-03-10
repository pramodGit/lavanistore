import React, { useState, useRef, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProfileDropdown() {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const { user, logout } = useContext(AuthContext); // get user state
    const navigate = useNavigate();

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSignOut = async () => {
        try {
            await logout();
            navigate("/auth/login");
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    if (!user) return null; // Hide completely if not logged in

    return (
        <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
            {/* Profile button */}
            <button
                onClick={() => setOpen(!open)}
                style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: 4,
                    borderRadius: "50%",
                }}
            >
                {/* Profile icon */}
                <svg width="24" height="22" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#ffffff" d="M9 0a9 9 0 0 0-9 9 8.654 8.654 0 0 0 .05.92 9 9 0 0 0 17.9 0A8.654 8.654 0 0 0 18 9a9 9 0 0 0-9-9zm5.42 13.42c-.01 0-.06.08-.07.08a6.975 6.975 0 0 1-10.7 0c-.01 0-.06-.08-.07-.08a.512.512 0 0 1-.09-.27.522.522 0 0 1 .34-.48c.74-.25 1.45-.49 1.65-.54a.16.16 0 0 1 .03-.13.49.49 0 0 1 .43-.36l1.27-.1a2.077 2.077 0 0 0-.19-.79v-.01a2.814 2.814 0 0 0-.45-.78 3.83 3.83 0 0 1-.79-2.38A3.38 3.38 0 0 1 8.88 4h.24a3.38 3.38 0 0 1 3.1 3.58 3.83 3.83 0 0 1-.79 2.38 2.814 2.814 0 0 0-.45.78v.01a2.077 2.077 0 0 0-.19.79l1.27.1a.49.49 0 0 1 .43.36.16.16 0 0 1 .03.13c.2.05.91.29 1.65.54a.49.49 0 0 1 .25.75z" />
                </svg>
            </button>

            {/* Dropdown menu */}
            {open && (
                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        top: "calc(100% + 0px)",
                        background: "#fff",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                        borderRadius: 6,
                        minWidth: 180,
                        zIndex: 100,
                        padding: 8,
                    }}
                >
                    {/* Email row */}
                    <div
                        style={{
                            padding: "6px 8px",
                            borderBottom: "1px solid #e5e7eb",
                            fontSize: 14,
                            fontWeight: 500,
                            color: "#111827",
                        }}
                    >
                        {user.email}
                    </div>

                    {/* Action buttons */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-around",
                            marginTop: 6,
                        }}
                    >
                        <button
                            style={linkStyle}
                            onClick={() => alert("Edit Profile clicked")}
                        >
                            Edit Profile
                        </button>
                        <button
                            style={{ ...linkStyle, color: "#dc2626" }}
                            onClick={handleSignOut}
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

const linkStyle: React.CSSProperties = {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 13,
    color: "#1f2937",
    padding: "4px 8px",
    borderRadius: 4,
};
