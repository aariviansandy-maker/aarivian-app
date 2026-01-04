// src/App.js
import React, { useState } from "react";
import { supabase } from "./supabaseClient";

const SERVICES = [
  "Nursing jobs",
  "Student Visa Support",
  "Legal / Immigration Consultation",
  "Accommodation & Hostel Help",
  "English Language Teaching Job",
  "Other – Custom Request",
];

function App() {
  const [service, setService] = useState(SERVICES[0]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitted(false);
    setError(null);
    setLoading(true);

    // NEW: if Supabase is not initialised, show a clear error
    if (!supabase) {
      console.error("Supabase client is not initialised – check env vars on Vercel.");
      setError("Configuration error: backend is not ready. Please try again later.");
      setLoading(false);
      return;
    }

    try {
      const { error: insertError } = await supabase.from("requests").insert([
        {
          full_name: fullName,
          email,
          phone,
          service,
          notes,
          status: "new",
        },
      ]);

      if (insertError) {
        console.error("Supabase insert error:", insertError);
        setError("Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      // Clear form on success
      setFullName("");
      setEmail("");
      setPhone("");
      setService(SERVICES[0]);
      setNotes("");

      setSubmitted(true);
    } catch (err) {
      console.error("Network / unknown error:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Aarivian Bridge</h1>
        <p style={styles.subtitle}>
          Tell us what you need. We will review your request and connect you
          with the right specialist.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Full Name
            <input
              style={styles.input}
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </label>

          <label style={styles.label}>
            Email Address
            <input
              style={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label style={styles.label}>
            Phone (WhatsApp)
            <input
              style={styles.input}
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </label>

          <label style={styles.label}>
            Service Required
            <select
              style={styles.input}
              value={service}
              onChange={(e) => setService(e.target.value)}
            >
              {SERVICES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <label style={styles.label}>
            Briefly describe your situation
            <textarea
              style={{ ...styles.input, minHeight: 80, resize: "vertical" }}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </label>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </form>

        {submitted && !error && (
          <p style={styles.success}>
            Thank you. Your request has been received. We will review it and
            contact you soon.
          </p>
        )}

        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "radial-gradient(circle at top, #ffe57f 0, #f9f9f9 40%, #f0f0f0 100%)",
    padding: "20px",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  },
  card: {
    maxWidth: 480,
    width: "100%",
    background: "#ffffff",
    padding: "28px 24px 30px",
    borderRadius: 16,
    boxShadow: "0 18px 40px rgba(0,0,0,0.08)",
  },
  title: {
    fontSize: 26,
    margin: "0 0 4px",
  },
  subtitle: {
    margin: "0 0 20px",
    color: "#555",
    fontSize: 14,
    lineHeight: 1.4,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: 500,
    color: "#333",
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  input: {
    fontSize: 14,
    padding: "8px 10px",
    borderRadius: 8,
    border: "1px solid #ddd",
    outline: "none",
  },
  button: {
    marginTop: 8,
    padding: "10px 14px",
    borderRadius: 999,
    border: "none",
    background: "linear-gradient(135deg, #ffb300, #ff6f00)",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  },
  success: {
    marginTop: 16,
    fontSize: 13,
    color: "#1b5e20",
  },
  error: {
    marginTop: 16,
    fontSize: 13,
    color: "#b71c1c",
  },
};

export default App;
