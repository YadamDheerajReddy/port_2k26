import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Site-wide social preview card (home page, and the fallback for any route
 * without its own opengraph-image.tsx). Same Ember & Ink palette as the
 * real site -- ink ground, ember radial glow -- though not the real Clash
 * Display face: lib/fonts.ts's copy is .woff2-only and Satori's font
 * parser (next/og's renderer) rejects woff2 with "Unsupported OpenType
 * signature wOF2", so this falls back to Satori's built-in sans at a bold
 * weight instead of risking the build on a font format it can't read.
 */
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0e0c0a",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            display: "flex",
            width: 1000,
            height: 1000,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,77,28,0.38) 0%, rgba(122,31,26,0.14) 45%, rgba(14,12,10,0) 72%)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 96,
              fontWeight: 700,
              color: "#f7f2e9",
              letterSpacing: -2,
              lineHeight: 1,
              textTransform: "uppercase",
            }}
          >
            Dheeraj Reddy
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 30,
              color: "#b8afa0",
              letterSpacing: 0.5,
            }}
          >
            Full-stack developer &amp; product builder
          </div>
        </div>
      </div>
    ),
    size,
  );
}
