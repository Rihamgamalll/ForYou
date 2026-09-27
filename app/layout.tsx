import "./globals.css";
import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.URL || process.env.DEPLOY_PRIME_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "ForYou — رسالة بشكل مختلف",
  description: "اكتب رسالة خاصة، اختار المناسبة وطريقة فتحها، وابعتها في لينك واحد.",
  themeColor: "#fbf8f3",
  openGraph: {
    title: "ForYou — Your message. Their moment.",
    description: "Create a private message and send it as a small interactive surprise.",
    type: "website",
    images: [{ url: "/og-home.png", width: 1200, height: 630, alt: "ForYou home page preview" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ForYou — Your message. Their moment.",
    description: "Create a private message and send it in one link.",
    images: ["/og-home.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
