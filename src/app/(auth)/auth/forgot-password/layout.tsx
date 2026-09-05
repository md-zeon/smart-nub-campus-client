import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Forgot Password | Smart NUB Campus",
  description:
    "Reset your Smart NUB Campus password to regain access to your account.",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordLayout({ children }: { children: ReactNode }) {
  return children;
}