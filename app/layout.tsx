import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import { ReducedMotionProvider } from "@/components/providers/ReducedMotionProvider";
import { IntroProvider } from "@/components/providers/IntroProvider";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { NameIntro } from "@/components/intro/NameIntro";
import { IntroSimple } from "@/components/intro/IntroSimple";
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
          <IntroProvider>
            <CustomCursor />
            <NameIntro />
            <IntroSimple />
            {children}
          </IntroProvider>
        </ReducedMotionProvider>
      </body>
    </html>
  );
}
