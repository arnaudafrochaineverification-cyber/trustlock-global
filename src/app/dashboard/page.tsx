
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type AccountInfo = {
  email: string;
  companyName: string;
  country: string;
  registrationNumber: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [account, setAccount] = useState<AccountInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadAccount() {
      const { data, error: authError } = await supabase.auth.getUser();

      if (!active) return;

      if (authError || !data.user || !data.user.email_confirmed_at) {
        router.replace("/login");
        return;
      }

      const metadata = data.user.user_metadata || {};

      setAccount({
        email: data.user.email || "",
        companyName: metadata.company_name || "Organization setup pending",
        country: metadata.registration_country || "Not provided",
        registrationNumber: metadata.registration_number || "Not provided"
      });

      setLoading(false);
    }

    loadAccount().catch(() => {
      if (active) {
        setError("Unable to load your account. Please sign in again.");
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  if (loading) {
    return (
      <main className="container" style={{ padding: "60px 20px" }}>
        Loading your TRUSTLOCK account...
      </main>
    );
  }

  if (!account) {
    return (
      <main className="container" style={{ padding: "60px 20px" }}>
        {error || "Please sign in to continue."}
      </main>
    );
  }

  return (
    <main className="container" style={{ padding: "40px 20px" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "15px"
        }}
      >
        <div>
          <p style={{ color: "#b58b32", fontWeight: 700 }}>
            TRUSTLOCK GLOBAL
          </p>
          <h1>Organization Dashboard</h1>
        </div>

        <button
          onClick={handleLogout}
          style={{
            background: "#08783e",
            color: "#fff",
            padding: "12px 18px",
            border: 0,
            borderRadius: "7px",
            fontWeight: 700
          }}
        >
          Sign out
        </button>
      </header>

      <section
        style={{
          marginTop: "30px",
          padding: "25px",
          background: "#fff",
          border: "1px solid #e5e5e5",
          borderRadius: "14px"
        }}
      >
        <h2>Organization account</h2>

        <p><strong>Organization:</strong> {account.companyName}</p>
        <p><strong>Owner email:</strong> {account.email}</p>
        <p><strong>Registration country:</strong> {account.country}</p>
        <p>
          <strong>Registration number:</strong>{" "}
          {account.registrationNumber}
        </p>

        <p style={{ color: "#946200", fontWeight: 700 }}>
          Organization database registration pending
        </p>

        <p style={{ color: "#666", lineHeight: 1.7 }}>
          Your account details have been received. Organization identity
          checks and official TRUSTLOCK ID assignment will take place
          after the protected registration process is completed.
        </p>
      </section>

      <section
        style={{
          marginTop: "22px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px"
        }}
      >
        {[
          ["Authorized officers", "Not configured"],
          ["Document approvals", "Not available yet"],
          ["QR verification", "Not available yet"],
          ["Audit history", "Not available yet"]
        ].map(([heading, description]) => (
          <article
            key={heading}
            style={{
              padding: "22px",
              border: "1px solid #e5e5e5",
              borderRadius: "12px",
              background: "#fff"
            }}
          >
            <h3>{heading}</h3>
            <p style={{ color: "#777" }}>{description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
