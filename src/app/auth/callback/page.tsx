
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const started = useRef(false);
  const [status, setStatus] = useState("Verifying your email...");
  const [error, setError] = useState("");

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    async function verifyEmail() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const authError =
        params.get("error_description") || params.get("error");

      if (authError) {
        setError(decodeURIComponent(authError.replace(/\+/g, " ")));
        setStatus("Email verification failed.");
        return;
      }

      if (!code) {
        setError(
          "The verification link is missing its authorization code. Please request a new verification email."
        );
        setStatus("Verification could not be completed.");
        return;
      }

      const { error: exchangeError } =
        await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) {
        setError(exchangeError.message);
        setStatus("Email verification failed.");
        return;
      }

      setStatus("Your email has been verified successfully.");
    }

    verifyEmail().catch(() => {
      setError("An unexpected error occurred. Please try again.");
      setStatus("Verification could not be completed.");
    });
  }, []);

  return (
    <main className="container" style={{ maxWidth: "650px", padding: "70px 20px" }}>
      <p style={{ color: "#b58b32", fontWeight: 700, letterSpacing: "2px" }}>
        TRUSTLOCK GLOBAL
      </p>

      <h1 style={{ fontSize: "30px" }}>Email verification</h1>

      <p style={{ lineHeight: 1.7 }}>{status}</p>

      {error && (
        <p role="alert" style={{ color: "#b42318", lineHeight: 1.7 }}>
          {error}
        </p>
      )}

      {!error && status.includes("successfully") && (
        <p style={{ color: "#08783e", lineHeight: 1.7 }}>
          Your account is now verified. The next step is organization setup.
        </p>
      )}

      <Link href="/" style={{ color: "#08783e", fontWeight: 700 }}>
        Return to TRUSTLOCK GLOBAL
      </Link>
    </main>
  );
}
