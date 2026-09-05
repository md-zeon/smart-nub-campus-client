import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { env } from "@/env";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(env.FRONTEND_URL),
  title: "Smart NUB Campus",
  description:
    "Smart NUB Campus is an exclusive platform for Northern University Bangladesh students. Collaborate, learn, share resources and grow together in a trusted academic environment.",
  creator: "Zeanur Rahaman Zeon",
  authors: [
    {
      name: "Zeanur Rahaman Zeon",
      url: "https://zeanurrahamanzeon.vercel.app/",
    },
  ],
  openGraph: {
    siteName: "Smart NUB Campus",
    type: "website",
    locale: "en_US",
    title: "Smart NUB Campus",
    description:
      "The exclusive academic platform for Northern University Bangladesh students.",
    images: [
      {
        url: "/images/og.png",
        width: 1200,
        height: 630,
        alt: "Smart NUB Campus — the academic platform for Northern University Bangladesh students.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart NUB Campus",
    description:
      "The exclusive academic platform for Northern University Bangladesh students.",
    images: ["/images/og.png"],
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        "scrollbar-thin",
        "scrollbar-track-gray-100",
        "scrollbar-thumb-blue-500",
        inter.variable,
      )}
      suppressHydrationWarning={true}
    >
      <head>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
      </head>
      <body className="h-full" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <main className="h-full">{children}</main>
          <Toaster richColors={true} />
        </ThemeProvider>
      </body>
    </html>
  );
}
