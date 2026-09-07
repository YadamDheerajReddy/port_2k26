import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dheeraj Reddy | Full-stack developer & product builder",
  description:
    "Full-stack developer who ships real products, from AI-powered apps to production client websites.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
