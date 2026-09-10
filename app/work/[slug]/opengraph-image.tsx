import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { projects } from "@/lib/content";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// A metadata-route file inside a dynamic segment needs its own
// generateStaticParams -- it's a separate route entry point from page.tsx,
// Next doesn't infer one from the other.
export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

/**
 * Per-project social preview: the project's own real hero screenshot as a
 * full-bleed background (read straight from public/, base64-inlined -- the
 * same honest screenshot the case study page itself shows, not a generic
 * card) under a dark gradient with the title over it, so a shared case
 * study link actually previews as that project rather than as the site's
 * generic home card. Title uses Satori's built-in bold sans, not the real
 * Clash Display face -- see app/opengraph-image.tsx's note on why (woff2
 * isn't a format Satori's font parser accepts).
 */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  const heroSrc = project?.media[0]?.src;
  let heroDataUri: string | null = null;
  if (heroSrc) {
    const bytes = await readFile(join(process.cwd(), "public", heroSrc));
    heroDataUri = `data:image/jpeg;base64,${bytes.toString("base64")}`;
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#0e0c0a",
        }}
      >
        {heroDataUri ? (
          // eslint-disable-next-line @next/next/no-img-element -- Satori's renderer, not next/image
          <img
            src={heroDataUri}
            alt=""
            width={size.width}
            height={size.height}
            style={{ objectFit: "cover", opacity: 0.5 }}
          />
        ) : null}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "linear-gradient(0deg, #0e0c0a 12%, rgba(14,12,10,0.55) 55%, rgba(14,12,10,0.8) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 72,
            bottom: 72,
            right: 72,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 24,
              color: "#ff4d1c",
              letterSpacing: 4,
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Case Study
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 84,
              fontWeight: 700,
              color: "#f7f2e9",
              letterSpacing: -1,
              lineHeight: 1,
            }}
          >
            {project?.title ?? "Dheeraj Reddy"}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
