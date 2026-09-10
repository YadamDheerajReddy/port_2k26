import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/lib/content";
import { CaseStudy } from "@/components/work/CaseStudy";
import { CaseStudyNextLink } from "@/components/work/CaseStudyNextLink";
import { Footer } from "@/components/footer/Footer";
import { ProjectJsonLd } from "@/components/seo/JsonLd";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.outcome,
    keywords: project.stack,
    alternates: {
      canonical: `/work/${project.slug}`,
    },
    openGraph: {
      type: "article",
      title: project.title,
      description: project.outcome,
      url: `/work/${project.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.outcome,
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = projects.findIndex((item) => item.slug === slug);
  if (index === -1) notFound();

  const nextIndex = (index + 1) % projects.length;

  return (
    <>
      <ProjectJsonLd project={projects[index]} />
      <main>
        <CaseStudy project={projects[index]} index={index} />
        <CaseStudyNextLink project={projects[nextIndex]} index={nextIndex} />
      </main>
      <Footer />
    </>
  );
}
