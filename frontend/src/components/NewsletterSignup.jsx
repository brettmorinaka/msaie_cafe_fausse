import { useState } from "react";
import "./NewsletterSignup.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    if (!EMAIL_RE.test(email.trim())) {
      setStatus({
        type: "error",
        message: "Please enter a valid email address.",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus({ type: "error", message: data.error || "Signup failed." });
        return;
      }
      setStatus({ type: "success", message: data.message });
      setEmail("");
    } catch {
      setStatus({
        type: "error",
        message: "Unable to reach the server. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="newsletter" aria-labelledby="newsletter-heading">
      <h2 id="newsletter-heading">Stay in the loop</h2>
      <p>Subscribe for seasonal menus, events, and exclusive offers.</p>
      <form className="newsletter-form" onSubmit={handleSubmit} noValidate>
        <label htmlFor="newsletter-email" className="visually-hidden">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Subscribing…" : "Subscribe"}
        </button>
      </form>
      {status.message && (
        <p
          className={`newsletter-status ${status.type}`}
          role={status.type === "error" ? "alert" : "status"}
        >
          {status.message}
        </p>
      )}
    </section>
  );
}
