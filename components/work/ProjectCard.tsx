import type { Project } from "@/lib/content";
import { StatusBadge, Tag } from "@/components/ui/Tag";

export function ProjectCard({
  project,
  large = false,
}: {
  project: Project;
  large?: boolean;
}) {
  const link = project.links.live ?? project.links.github ?? project.links.paper;

  const Card = (
    <div
      className={`rounded-card bg-ink-raised flex h-full flex-col justify-between border border-[var(--border-subtle)] p-6 transition-colors duration-[var(--dur-fast)] ${
        link ? "hover:border-ember" : ""
      } ${large ? "md:p-10" : ""}`}
    >
      <div>
        <div className="flex items-start justify-between gap-4">
          <h3
            className={`font-display text-[var(--text-primary)] ${large ? "text-display-2" : "text-display-3"}`}
          >
            {project.title}
          </h3>
          <StatusBadge status={project.status} />
        </div>

        <p className="font-body text-body mt-4 text-[var(--text-secondary)]">
          {project.outcome}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {project.stack.map((item) => (
          <Tag key={item}>{item}</Tag>
        ))}
      </div>
    </div>
  );

  if (!link) return Card;

  return (
    <a href={link} target="_blank" rel="noopener noreferrer" className="block h-full">
      {Card}
    </a>
  );
}
