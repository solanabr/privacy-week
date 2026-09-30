import Link from "next/link";

import { categoryLabels, techLabels } from "@/content/labels";
import { projectsPage } from "@/content/projects";
import type { PublicSubmission } from "@/lib/db/submissions";

import { TicketCard } from "./ticket";

export function ProjectCard({ project }: { project: PublicSubmission }) {
  return (
    <li>
      <TicketCard
        header={categoryLabels[project.category]}
        serial={`Nº ${String(project.number).padStart(4, "0")}`}
        fields={[
          { label: projectsPage.project, value: project.project_name },
          { label: projectsPage.team, value: project.team_name || "—" },
          { label: projectsPage.filters.tech, value: techLabels[project.tech] },
          { label: projectsPage.tagline, value: project.tagline },
        ]}
        footer={
          <Link
            href={`/projetos/${project.slug}`}
            className="cut-corner-sm inline-flex min-h-11 items-center justify-center bg-emerald px-4 py-2 font-display text-sm font-extrabold uppercase tracking-wide text-surface-raised hover:bg-emerald-deep"
          >
            {projectsPage.openProject}
          </Link>
        }
        className="h-full"
      />
    </li>
  );
}
