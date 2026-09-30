import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Eyebrow } from "@/components/eyebrow";
import { Section } from "@/components/section";
import { categoryLabels, techLabels } from "@/content/labels";
import { projectDetail } from "@/content/projects";
import { getPublicSubmissionBySlug } from "@/lib/db/submissions";
import { safeHttpsUrl } from "@/lib/safe-url";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/projetos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublicSubmissionBySlug(slug);
  if (!project) return { title: projectDetail.notFoundTitle };
  return {
    title: project.project_name,
    description: project.tagline,
    openGraph: { title: project.project_name, description: project.tagline },
  };
}

function ExternalField({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  const href = safeHttpsUrl(value);
  if (!href) return null;
  return (
    <p>
      <span className="u-mono text-muted">{label}</span>
      <br />
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="break-all text-green underline underline-offset-4"
      >
        {value}
      </a>
    </p>
  );
}

export default async function ProjectDetailPage({
  params,
}: PageProps<"/projetos/[slug]">) {
  const { slug } = await params;
  const project = await getPublicSubmissionBySlug(slug);
  if (!project) notFound();

  const proofLink =
    project.proof_type === "app_url" ? safeHttpsUrl(project.proof_value) : null;

  return (
    <>
      <Section tone="deep">
        <div className="flex max-w-4xl flex-col gap-5">
          <Eyebrow>{projectDetail.eyebrow} · Nº {String(project.number).padStart(4, "0")}</Eyebrow>
          <h1 className="break-words text-4xl uppercase sm:text-6xl">
            {project.project_name}
          </h1>
          <p className="max-w-3xl text-xl font-semibold">{project.tagline}</p>
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted">
            <p>
              <span className="u-mono">{projectDetail.category}</span>
              <br />
              {categoryLabels[project.category]}
            </p>
            <p>
              <span className="u-mono">{projectDetail.tech}</span>
              <br />
              {techLabels[project.tech]}
            </p>
            {project.team_name ? (
              <p>
                <span className="u-mono">{projectDetail.team}</span>
                <br />
                {project.team_name}
              </p>
            ) : null}
          </div>
        </div>
      </Section>
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="flex min-w-0 flex-col gap-8">
            <section>
              <h2 className="u-mono mb-3 text-emerald">{projectDetail.writeup}</h2>
              <p className="max-w-3xl whitespace-pre-line text-base leading-relaxed text-ink/90">
                {project.writeup}
              </p>
            </section>
            <section>
              <h2 className="u-mono mb-3 text-emerald">{projectDetail.changes}</h2>
              <p className="whitespace-pre-line text-base text-ink/90">
                {project.sprint_changes}
              </p>
            </section>
            <section>
              <h2 className="u-mono mb-3 text-emerald">{projectDetail.proof}</h2>
              <p className="mb-2 text-sm text-muted">
                {projectDetail.proofTypes[project.proof_type]}
              </p>
              {proofLink ? (
                <a
                  href={proofLink}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="break-all text-green underline underline-offset-4"
                >
                  {project.proof_value}
                </a>
              ) : (
                <code className="break-all rounded bg-surface-deep px-2 py-1 text-sm">
                  {project.proof_value}
                </code>
              )}
            </section>
            <section>
              <h2 className="u-mono mb-3 text-emerald">{projectDetail.demo}</h2>
              <ExternalField label={projectDetail.demo} value={project.demo_video_url} />
            </section>
          </div>

          <aside className="flex flex-col gap-5">
            <div className="cut-corner-one flex flex-col gap-4 border border-ink/15 bg-surface-raised p-5">
              <h2 className="u-mono text-emerald">{projectDetail.repository}</h2>
              <ExternalField label={projectDetail.repository} value={project.repo_url} />
              <ExternalField label={projectDetail.projectPage} value={project.colosseum_url} />
              <ExternalField label={projectDetail.website} value={project.website_url} />
            </div>

            {project.members.length > 0 ? (
              <div className="cut-corner-one border border-ink/15 bg-surface-raised p-5">
                <h2 className="u-mono mb-4 text-emerald">{projectDetail.members}</h2>
                <ul className="flex flex-col gap-4">
                  {project.members.map((member, index) => (
                    <li key={`${member.name}-${index}`} className="flex flex-col gap-1">
                      <span className="font-semibold">{member.name}</span>
                      <div className="flex flex-wrap gap-3 text-sm">
                        {member.x ? (
                          <ExternalField label={projectDetail.x} value={`https://x.com/${encodeURIComponent(member.x.replace(/^@/, ""))}`} />
                        ) : null}
                        {member.github ? (
                          <ExternalField label={projectDetail.github} value={`https://github.com/${encodeURIComponent(member.github.replace(/^@/, ""))}`} />
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </div>
        <div className="mt-10">
          <Link
            href="/projetos"
            className="inline-flex min-h-11 items-center text-sm font-semibold text-ink underline underline-offset-4"
          >
            {projectDetail.backArrow} {projectDetail.back}
          </Link>
        </div>
      </Section>
    </>
  );
}
