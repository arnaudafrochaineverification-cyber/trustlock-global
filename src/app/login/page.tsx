
"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password
        });

      if (loginError) throw loginError;

      if (!data.user?.email_confirmed_at) {
        await supabase.auth.signOut();
        throw new Error("Please verify your email before signing in.");
      }

      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Login could not be completed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="container"
      style={{ maxWidth: "550px", padding: "55px 20px" }}
    >
      <p style={{ color: "#b58b32", fontWeight: 700, letterSpacing: "2px" }}>
        TRUSTLOCK GLOBAL
      </p>

      <h1 style={{ fontSize: "32px" }}>Organization Login</h1>

      <p style={{ color: "#666", lineHeight: 1.7 }}>
        Sign in to access your TRUSTLOCK organization account.
      </p>

      <form
        onSubmit={handleLogin}
        style={{
          display: "grid",
          gap: "18px",
          background: "#fff",
          padding: "25px",
          border: "1px solid #e5e5e5",
          borderRadius: "14px"
        }}
      >
        <label>
          Email address
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="you@company.com"
            style={inputStyle}
          />
        </label>

        <label>
          Password
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            placeholder="Enter your password"
            style={inputStyle}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{
            background: "#08783e",
            color: "#fff",
            border: 0,
            borderRadius: "8px",
            padding: "15px",
            fontSize: "16px",
            fontWeight: 700
          }}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        {error && (
          <p role="alert" style={{ color: "#b42318" }}>
            {error}
          </p>
        )}
      </form>

      <p style={{ marginTop: "22px" }}>
        New organization?{" "}
        <Link href="/register" style={{ color: "#08783e", fontWeight: 700 }}>
          Register here
        </Link>
      </p>
    </main>
  );
}

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "13px",
  marginTop: "8px",
  border: "1px solid #ccc",
  borderRadius: "7px",
  fontSize: "15px",
  boxSizing: "border-box" as const
};
