import localFont from "next/font/local";
import { Space_Mono } from "next/font/google";

/**
 * Self-hosted Fontshare files. See docs/Typography.md section 4 for the
 * loading strategy and docs/Typography.md section 1 for what each font is
 * for. Gambetta uses "optional" instead of "swap": the name intro depends
 * on it rendering correctly on first paint, so if it is not cached in time
 * the fallback stays rather than swapping in mid-animation.
 */

export const gambetta = localFont({
  src: [
    {
      path: "../public/fonts/Gambetta-MediumItalic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../public/fonts/Gambetta-SemiboldItalic.woff2",
      weight: "600",
      style: "italic",
    },
  ],
  variable: "--font-gambetta",
  display: "optional",
});

export const clashDisplay = localFont({
  src: [
    { path: "../public/fonts/ClashDisplay-Medium.woff2", weight: "500", style: "normal" },
    {
      path: "../public/fonts/ClashDisplay-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-clash-display",
  display: "swap",
});

export const switzer = localFont({
  src: [
    { path: "../public/fonts/Switzer-Medium.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/Switzer-Semibold.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-switzer",
  display: "swap",
});

export const generalSans = localFont({
  src: [
    { path: "../public/fonts/GeneralSans-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/GeneralSans-Medium.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-general-sans",
  display: "swap",
});

export const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

export const fontVariables = [
  gambetta.variable,
  clashDisplay.variable,
  switzer.variable,
  generalSans.variable,
  spaceMono.variable,
].join(" ");
