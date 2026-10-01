import Link from "next/link";

import { Badge } from "@/components/badge";
import { CutLink } from "@/components/cut-button";
import { Eyebrow } from "@/components/eyebrow";
import { PillLink } from "@/components/pill-link";
import { ProjectCard } from "@/components/project-card";
import { Section } from "@/components/section";
import { categoryLabels, techLabels } from "@/content/labels";
import { projectsPage } from "@/content/projects";
import { cta } from "@/content/site";
import {
  CATEGORIES,
  TECHS,
  type Category,
  type Tech,
} from "@/lib/validation";
import { listPublicSubmissions } from "@/lib/db/submissions";
import { getWindowState } from "@/lib/window";

export const dynamic = "force-dynamic";

function selectedValue<T extends string>(
  value: string | string[] | undefined,
  allowed: readonly T[],
): T | undefined {
  const candidate = Array.isArray(value) ? value[0] : value;
  return candidate && allowed.includes(candidate as T)
    ? (candidate as T)
    : undefined;
}

function filterHref(filters: { category?: Category; tech?: Tech }): string {
  const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category);
  if (filters.tech) params.set("tech", filters.tech);
  const query = params.toString();
  return query ? `/projetos?${query}` : "/projetos";
}

export default async function ProjectsPage({
  searchParams,
}: PageProps<"/projetos">) {
  const params = await searchParams;
  const category = selectedValue<Category>(params.category, CATEGORIES);
  const tech = selectedValue<Tech>(params.tech, TECHS);
  const projects = await listPublicSubmissions({ category, tech });
  const isOpen = getWindowState() === "open";
  const filtered = Boolean(category || tech);

  return (
    <>
      <Section tone="deep" padding="sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex max-w-3xl flex-col gap-4">
            <Eyebrow>{projectsPage.eyebrow}</Eyebrow>
            <h1 className="u-display text-4xl sm:text-5xl lg:text-6xl">
              {projectsPage.title}
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              {projectsPage.intro}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone="ink">{projectsPage.count(projects.length)}</Badge>
            {isOpen ? (
              <CutLink href="/enviar" variant="primary" size="sm">
                {cta.submit}
              </CutLink>
            ) : null}
          </div>
        </div>
      </Section>

      <Section>
        <div className="mb-10 flex flex-col gap-5 border-y-2 border-ink/10 py-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="u-mono mr-2 w-36 shrink-0 text-muted">
              {projectsPage.filters.category}
            </span>
            <PillLink href={filterHref({ tech })} active={!category}>
              {projectsPage.filters.any}
            </PillLink>
            {CATEGORIES.map((value) => (
              <PillLink
                key={value}
                href={filterHref({ category: value, tech })}
                active={category === value}
              >
                {categoryLabels[value]}
              </PillLink>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="u-mono mr-2 w-36 shrink-0 text-muted">
              {projectsPage.filters.tech}
            </span>
            <PillLink href={filterHref({ category })} active={!tech}>
              {projectsPage.filters.any}
            </PillLink>
            {TECHS.map((value) => (
              <PillLink
                key={value}
                href={filterHref({ category, tech: value })}
                active={tech === value}
              >
                {techLabels[value]}
              </PillLink>
            ))}
            {filtered ? (
              <Link
                href="/projetos"
                className="ml-auto text-sm font-semibold text-ink underline underline-offset-4"
              >
                {projectsPage.filters.clear}
              </Link>
            ) : null}
          </div>
        </div>

        {projects.length > 0 ? (
          <ul className="grid items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </ul>
        ) : (
          <div className="sticker mx-auto flex max-w-xl flex-col items-center gap-3 p-10 text-center">
            <span className="numeral text-6xl">0</span>
            <p className="font-display text-xl font-black">{projectsPage.emptyTitle}</p>
            <p className="text-sm text-muted">{projectsPage.empty}</p>
            {filtered ? (
              <CutLink href="/projetos" variant="outline" size="sm" className="mt-2">
                {projectsPage.filters.clear}
              </CutLink>
            ) : null}
          </div>
        )}
      </Section>
    </>
  );
}
