import { profile, skillGroups, type Project } from "@/lib/content";

const SITE_URL = "https://dheerajdev.space";

/**
 * schema.org structured data, rendered as inline JSON-LD script tags.
 * Server components only (no client interactivity needed) so these ship as
 * plain static markup with no hydration cost. Kept deliberately honest --
 * only fields backed by real data in lib/content.ts, nothing invented to
 * pad out the schema (no fabricated ratings, prices, or employer).
 */
export function PersonJsonLd() {
  const json = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: SITE_URL,
    email: `mailto:${profile.email}`,
    sameAs: [profile.github, profile.linkedin],
    jobTitle: "Full-stack developer",
    knowsAbout: skillGroups.flatMap((group) => group.items),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

export function ProjectJsonLd({ project }: { project: Project }) {
  const image = project.media[0];
  const json = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.outcome,
    url: `${SITE_URL}/work/${project.slug}`,
    ...(image ? { image: `${SITE_URL}${image.src}` } : {}),
    creator: {
      "@type": "Person",
      name: profile.name,
      url: SITE_URL,
    },
    ...(project.links.live ? { sameAs: [project.links.live] } : {}),
    ...(project.stack.length > 0 ? { keywords: project.stack.join(", ") } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
