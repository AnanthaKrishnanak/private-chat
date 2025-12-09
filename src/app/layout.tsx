import type { Metadata } from "next";
import { Fira_Code } from "next/font/google";

import "./globals.css";
import Providers from "@/components/providers";
import { Suspense } from "react";

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
});

export const metadata: Metadata = {
  title: "Private Chat | Secure & Fast Messaging",
  description:
    "A private, secure, and fast chat experience built with modern web technologies.",
  keywords: [
    "private chat",
    "secure messaging",
    "real-time chat",
    "fast chat app",
    "modern messaging UI",
  ],
  authors: [{ name: "Your App" }],
  applicationName: "Private Chat",
  openGraph: {
    title: "Private Chat",
    description:
      "A secure and private chat application with smooth UI and great performance.",
    url: "https://private-chat-green.vercel.app/",
    siteName: "Private Chat",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Private Chat",
    description:
      "A secure and private chat application with smooth UI and great performance.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${firaCode.variable} dark antialiased`}>
        <Suspense>
          <Providers>{children}</Providers>
        </Suspense>
      </body>
    </html>
  );
}
