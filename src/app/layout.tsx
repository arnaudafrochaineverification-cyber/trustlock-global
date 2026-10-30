
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TRUSTLOCK GLOBAL | Secure Authorization",
  description:
    "Global document authorization, integrity protection and independent verification by ARNAUD AFROCHAINE TRUST SYSTEMS LTD.",
  applicationName: "TRUSTLOCK GLOBAL",
  keywords: [
    "TRUSTLOCK",
    "document verification",
    "secure authorization",
    "digital trust",
    "global verification"
  ]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
