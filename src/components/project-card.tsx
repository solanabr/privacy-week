import { categoryLabels, techLabels } from "@/content/labels";
import { projectsPage } from "@/content/projects";
import type { PublicSubmission } from "@/lib/db/submissions";

import { Badge } from "./badge";
import { CutLink } from "./cut-button";

export function ProjectCard({
  project,
  prize,
}: {
  project: PublicSubmission;
  /** A prize label pins a yellow badge to the card. */
  prize?: string;
}) {
  return (
    <li className="h-full">
      <article className="sticker sticker-hover flex h-full flex-col gap-4 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <Badge tone={prize ? "yellow" : "emerald"}>
            {prize ?? categoryLabels[project.category]}
          </Badge>
          <span className="u-mono whitespace-nowrap text-muted">
            {projectsPage.number} {String(project.number).padStart(4, "0")}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="break-words font-display text-2xl font-black leading-tight">
            {project.project_name}
          </h2>
          <p className="text-sm leading-relaxed text-muted">{project.tagline}</p>
        </div>

        <dl className="mt-auto grid grid-cols-2 items-end gap-3 border-t-2 border-ink/10 pt-4 text-sm">
          <div className="flex min-w-0 flex-col gap-1">
            <dt className="u-mono text-muted">{projectsPage.team}</dt>
            <dd className="truncate font-semibold">{project.team_name || "—"}</dd>
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <dt className="u-mono text-muted">{projectsPage.filters.tech}</dt>
            <dd className="font-semibold">
              {prize ? categoryLabels[project.category] : techLabels[project.tech]}
            </dd>
          </div>
        </dl>

        <CutLink href={`/projetos/${project.slug}`} variant="primary" size="sm">
          {projectsPage.openProject}
        </CutLink>
      </article>
    </li>
  );
}
