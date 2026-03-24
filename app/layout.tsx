import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HealthPay - Healthcare Payments Made Simple",
  description:
    "Nigeria's unified digital healthcare payments and billing platform. Seamless transactions for patients, providers, and insurers. Powered by Interswitch.",
  keywords: [
    "healthcare",
    "payments",
    "Nigeria",
    "Interswitch",
    "digital health",
    "appointments",
    "billing",
  ],
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
