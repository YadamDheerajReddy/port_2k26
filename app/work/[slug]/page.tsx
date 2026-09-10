import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/lib/content";
import { CaseStudy } from "@/components/work/CaseStudy";
import { CaseStudyNextLink } from "@/components/work/CaseStudyNextLink";
import { Footer } from "@/components/footer/Footer";

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
    title: `${project.title} | Dheeraj Reddy`,
    description: project.outcome,
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
      <main>
        <CaseStudy project={projects[index]} index={index} />
        <CaseStudyNextLink project={projects[nextIndex]} index={nextIndex} />
      </main>
      <Footer />
    </>
  );
}
