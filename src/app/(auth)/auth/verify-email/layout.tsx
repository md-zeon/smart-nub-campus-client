import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Verify Email | Smart NUB Campus",
  description:
    "Verify your email address to activate your Smart NUB Campus account.",
  robots: { index: false, follow: false },
};

export default function VerifyEmailLayout({ children }: { children: ReactNode }) {
  return children;
}