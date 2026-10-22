import { useState } from "react";
import { login } from "../api.js";

export default function LoginForm({ onLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    if (!email.trim() || !password) {
      setSuccess("");
      setError("Email and password are required");
      return;
    }
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const result = await login(email, password);
      localStorage.setItem("token", result.access_token);
      setSuccess(`Signed in as ${email}`);
      if (onLoggedIn) onLoggedIn(email);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <form className="login-card" noValidate onSubmit={handleSubmit}>
        <h1>Log in</h1>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && (
          <p role="alert" className="message message--error">
            {error}
          </p>
        )}
        {success && <p className="message message--success">{success}</p>}
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>
    </main>
  );
}
