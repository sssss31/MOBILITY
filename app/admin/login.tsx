"use client";
import { useState } from "react";

export function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(payload.error || "Sign in failed");
        setBusy(false);
        return;
      }
      window.location.reload();
    } catch {
      setError("Network error. Please try again.");
      setBusy(false);
    }
  }

  return (
    <main className="admin-main" style={{ maxWidth: 420, margin: "10vh auto" }}>
      <div className="admin-card">
        <span className="eyebrow">Secure admin portal</span>
        <h1>MobilityOne Admin</h1>
        <p>Enter the administrator password to continue.</p>
        <form onSubmit={submit}>
          <label className="field full">
            <span>Password</span>
            <input
              type="password"
              value={password}
              autoFocus
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error && (
            <div className="admin-card" style={{ borderColor: "#f4252c", color: "#b5161c" }}>
              {error}
            </div>
          )}
          <div className="field full">
            <button className="btn btn-primary" type="submit" disabled={busy}>
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
