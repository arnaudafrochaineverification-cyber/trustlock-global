
"use client";

import { useState, FormEvent } from "react";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const [companyName, setCompanyName] = useState("");
  const [country, setCountry] = useState("NG");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (password.length < 12) {
      setError("Please use a password with at least 12 characters.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: signUpError } =
        await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            data: {
              account_type: "organization_owner",
              company_name: companyName.trim(),
              registration_country: country,
              registration_number: registrationNumber.trim()
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        });

      if (signUpError) {
        throw signUpError;
      }

      if (data.user) {
        setMessage(
          "Your account registration has been submitted. Check your email for the verification link before continuing."
        );

        setPassword("");
      } else {
        setMessage(
          "Please check your email for further registration instructions."
        );
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Registration could not be completed.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container" style={{ maxWidth: "680px", padding: "48px 20px" }}>
      <div style={{ marginBottom: "30px" }}>
        <p style={{ color: "#b58b32", fontWeight: 700, letterSpacing: "2px" }}>
          TRUSTLOCK GLOBAL
        </p>

        <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>
          Organization Registration
        </h1>

        <p style={{ color: "#666", lineHeight: 1.7 }}>
          Create your organization owner's account to begin setting up
          your organization on TRUSTLOCK GLOBAL.
        </p>
      </div>

      <form
        onSubmit={handleRegister}
        style={{
          display: "grid",
          gap: "18px",
          background: "#fff",
          padding: "25px",
          borderRadius: "14px",
          border: "1px solid #e5e5e5"
        }}
      >
        <label>
          <span>Legal company or organization name</span>
          <input
            required
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Enter registered organization name"
            autoComplete="organization"
            style={inputStyle}
          />
        </label>

        <label>
          <span>Country of registration</span>
          <select
            required
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            style={inputStyle}
          >
            <option value="NG">Nigeria</option>
            <option value="GB">United Kingdom</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="AU">Australia</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
            <option value="GH">Ghana</option>
            <option value="ZA">South Africa</option>
            <option value="AE">United Arab Emirates</option>
            <option value="OTHER">Other country</option>
          </select>
        </label>

        <label>
          <span>Company registration number</span>
          <input
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value)}
            placeholder="Enter registration number, if available"
            style={inputStyle}
          />
        </label>

        <label>
          <span>Owner's email address</span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            autoComplete="email"
            style={inputStyle}
          />
        </label>

        <label>
          <span>Create a password</span>
          <input
            required
            type="password"
            minLength={12}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 12 characters"
            autoComplete="new-password"
            style={inputStyle}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{
            background: "#08783e",
            color: "#fff",
            padding: "15px",
            border: 0,
            borderRadius: "8px",
            fontWeight: 700,
            fontSize: "16px",
            cursor: loading ? "wait" : "pointer"
          }}
        >
          {loading ? "Creating account..." : "Create organization account"}
        </button>

        {message && (
          <p role="status" style={{ color: "#08783e", lineHeight: 1.6 }}>
            {message}
          </p>
        )}

        {error && (
          <p role="alert" style={{ color: "#b42318", lineHeight: 1.6 }}>
            {error}
          </p>
        )}
      </form>

      <p style={{ marginTop: "24px", color: "#777", fontSize: "13px" }}>
        TRUSTLOCK GLOBAL is operated by ARNAUD AFROCHAINE TRUST SYSTEMS LTD.
        Organization registration is subject to verification and approval.
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
