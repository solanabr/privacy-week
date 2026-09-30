import Link from "next/link";

import { ProjectCard } from "@/components/project-card";
import { Eyebrow } from "@/components/eyebrow";
import { Section } from "@/components/section";
import { categoryLabels, techLabels } from "@/content/labels";
import { projectsPage } from "@/content/projects";
import {
  CATEGORIES,
  TECHS,
  type Category,
  type Tech,
} from "@/lib/validation";
import { listPublicSubmissions } from "@/lib/db/submissions";

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

export default async function ProjectsPage({
  searchParams,
}: PageProps<"/projetos">) {
  const params = await searchParams;
  const category = selectedValue<Category>(params.category, CATEGORIES);
  const tech = selectedValue<Tech>(params.tech, TECHS);
  const projects = await listPublicSubmissions({ category, tech });

  return (
    <>
      <Section tone="deep">
        <div className="flex max-w-3xl flex-col gap-4">
          <Eyebrow>{projectsPage.eyebrow}</Eyebrow>
          <h1 className="text-4xl uppercase sm:text-5xl">{projectsPage.title}</h1>
          <p className="text-base text-muted">{projectsPage.intro}</p>
        </div>
      </Section>
      <Section>
        <form
          action="/projetos"
          method="get"
          className="mb-10 flex flex-col gap-4 border-y border-ink/15 py-5 sm:flex-row sm:items-end"
        >
          <label className="flex flex-1 flex-col gap-2 text-sm font-semibold">
            <span>{projectsPage.filters.category}</span>
            <select
              name="category"
              defaultValue={category ?? ""}
              className="min-h-11 border border-ink/20 bg-surface-raised px-3"
            >
              <option value="">{projectsPage.filters.all}</option>
              {CATEGORIES.map((value) => (
                <option key={value} value={value}>
                  {categoryLabels[value]}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-1 flex-col gap-2 text-sm font-semibold">
            <span>{projectsPage.filters.tech}</span>
            <select
              name="tech"
              defaultValue={tech ?? ""}
              className="min-h-11 border border-ink/20 bg-surface-raised px-3"
            >
              <option value="">{projectsPage.filters.all}</option>
              {TECHS.map((value) => (
                <option key={value} value={value}>
                  {techLabels[value]}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className="cut-corner-sm min-h-11 bg-emerald px-5 font-display text-sm font-extrabold uppercase tracking-wide text-surface-raised hover:bg-emerald-deep"
          >
            {projectsPage.filters.apply}
          </button>
          <Link
            href="/projetos"
            className="inline-flex min-h-11 items-center justify-center px-3 text-sm font-semibold text-ink underline underline-offset-4"
          >
            {projectsPage.filters.clear}
          </Link>
        </form>

        {projects.length > 0 ? (
          <ul className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </ul>
        ) : (
          <p className="cut-corner-one max-w-2xl border border-ink/15 bg-surface-raised p-6 text-muted">
            {projectsPage.empty}
          </p>
        )}
      </Section>
    </>
  );
}
