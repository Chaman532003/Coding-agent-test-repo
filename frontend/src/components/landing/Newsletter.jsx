import { useState } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState("");

  function submit(e) {
    e.preventDefault();
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setError("Enter a valid email address");
      setDone("");
      return;
    }
    setError("");
    setDone(`Thanks for subscribing, ${value}`);
    setEmail("");
  }

  return (
    <section className="newsletter">
      <div className="section-inner newsletter-inner">
        <h3>Get deals in your inbox</h3>
        <p>Join our newsletter for weekly offers and new arrivals. No spam, unsubscribe any time.</p>
        <form onSubmit={submit} noValidate>
          <label htmlFor="newsletter-email">Email address</label>
          <input id="newsletter-email" type="email" value={email} placeholder="you@example.com"
            onChange={(e) => setEmail(e.target.value)} />
          <button type="submit" className="btn-light">Subscribe</button>
        </form>
        {error && <p role="alert" className="form-error">{error}</p>}
        {done && <p role="status" className="form-ok">{done}</p>}
      </div>
    </section>
  );
}
