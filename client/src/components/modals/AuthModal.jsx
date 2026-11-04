import { useState } from "react";
import { SignInButton, SignUpButton } from "@clerk/react";
import { useAuth } from "../../context/AuthContext";
import { Icons } from "../common/Icons";

export function AuthModal({ onClose }) {
  const { login, register } = useAuth();
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("CUSTOMER");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res =
      tab === "login"
        ? await login(email, password)
        : await register({ name, email, password, role });

    setLoading(false);
    if (res.success) {
      onClose();
    } else {
      setError(res.message);
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="modal-dialog"
        style={{ maxWidth: "420px", padding: "32px" }}
      >
        <button
          className="btn-modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          <Icons.Close />
        </button>

        <div
          style={{
            display: "flex",
            borderBottom: "1px solid var(--slate-200)",
            marginBottom: "20px",
          }}
        >
          <button
            style={{
              flex: 1,
              padding: "10px",
              fontWeight: 700,
              fontSize: "14px",
              borderBottom:
                tab === "login" ? "2px solid var(--slate-950)" : "none",
              color: tab === "login" ? "var(--slate-950)" : "var(--slate-400)",
            }}
            onClick={() => {
              setTab("login");
              setError(null);
            }}
          >
            Sign In
          </button>
          <button
            style={{
              flex: 1,
              padding: "10px",
              fontWeight: 700,
              fontSize: "14px",
              borderBottom:
                tab === "register" ? "2px solid var(--slate-950)" : "none",
              color:
                tab === "register" ? "var(--slate-950)" : "var(--slate-400)",
            }}
            onClick={() => {
              setTab("register");
              setError(null);
            }}
          >
            Create Account
          </button>
        </div>

        {/* Primary Modern Auth: Clerk Fast SSO / Passwordless */}
        {tab === "login" ? (
          <SignInButton mode="modal">
            <button
              type="button"
              className="btn-primary"
              style={{
                width: "100%",
                marginBottom: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
              onClick={onClose}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              Sign In with Clerk
            </button>
          </SignInButton>
        ) : (
          <SignUpButton mode="modal">
            <button
              type="button"
              className="btn-primary"
              style={{
                width: "100%",
                marginBottom: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
              onClick={onClose}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              Sign Up with Clerk
            </button>
          </SignUpButton>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            margin: "14px 0",
            color: "var(--slate-400)",
            fontSize: "12px",
          }}
        >
          <div
            style={{ flex: 1, height: "1px", background: "var(--slate-200)" }}
          />
          <span style={{ padding: "0 8px" }}>or with email & password</span>
          <div
            style={{ flex: 1, height: "1px", background: "var(--slate-200)" }}
          />
        </div>

        {error && (
          <div
            style={{
              padding: "8px 12px",
              background: "var(--rose-50)",
              color: "var(--rose-600)",
              borderRadius: "6px",
              fontSize: "13px",
              marginBottom: "14px",
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          {tab === "register" && (
            <>
              <div>
                <label
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  className="search-input"
                  style={{ borderRadius: "8px", padding: "0 12px" }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    display: "block",
                    marginBottom: "4px",
                  }}
                >
                  Account Role
                </label>
                <select
                  className="facet-select"
                  style={{ width: "100%", height: "38px" }}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="CUSTOMER">Customer</option>
                  <option value="EDITOR">Editor</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label
              style={{
                fontSize: "12px",
                fontWeight: 600,
                display: "block",
                marginBottom: "4px",
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              required
              className="search-input"
              style={{ borderRadius: "8px", padding: "0 12px" }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="editor@curated.com"
            />
          </div>

          <div>
            <label
              style={{
                fontSize: "12px",
                fontWeight: 600,
                display: "block",
                marginBottom: "4px",
              }}
            >
              Password
            </label>
            <input
              type="password"
              required
              className="search-input"
              style={{ borderRadius: "8px", padding: "0 12px" }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-hero-primary"
            style={{
              width: "100%",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            {loading
              ? "Processing…"
              : tab === "login"
                ? "Sign In"
                : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthModal;
