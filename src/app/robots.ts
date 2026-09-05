import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin",
          "/messages",
          "/notifications",
          "/settings",
          "/ai/",
          "/auth/login",
          "/auth/onboarding",
          "/auth/forgot-password",
          "/auth/reset-password",
          "/auth/verify-email",
        ],
      },
    ],
    sitemap: "/sitemap.xml",
  };
}