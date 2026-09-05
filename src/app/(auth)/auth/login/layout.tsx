import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Login | Smart NUB Campus",
  description:
    "Log in to access your Smart NUB Campus account — the trusted academic platform for Northern University Bangladesh students.",
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: ReactNode }) {
  return children;
}