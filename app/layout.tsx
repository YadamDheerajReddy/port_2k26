import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import { ReducedMotionProvider } from "@/components/providers/ReducedMotionProvider";
import { CustomCursor } from "@/components/ui/CustomCursor";
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
    <html lang="en" className={fontVariables}>
      <body className="font-body antialiased">
        <ReducedMotionProvider>
          <CustomCursor />
          {children}
        </ReducedMotionProvider>
      </body>
    </html>
  );
}
