import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/badge";
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

function ArrowOut() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className="h-3.5 w-3.5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 12 12 4M6 4h6v6" />
    </svg>
  );
}

/** Insert soft break opportunities after each slash, so long URLs wrap at
 * path boundaries instead of mid-token. */
function breakable(value: string): React.ReactNode[] {
  return value.split(/(?<=\/)/).flatMap((part, index) =>
    index === 0 ? [part] : [<wbr key={index} />, part],
  );
}

function LinkRow({
  label,
  value,
  display,
}: {
  label: string;
  value: string | null;
  display?: string;
}) {
  const href = safeHttpsUrl(value);
  if (!href) return null;
  return (
    <li className="flex flex-col gap-1 py-3">
      <span className="u-mono text-muted">{label}</span>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="inline-flex items-start gap-2 [overflow-wrap:anywhere] text-sm font-semibold text-emerald-deep underline-offset-4 hover:underline"
      >
        <span>{display ?? breakable(value ?? href)}</span>
        <ArrowOut />
      </a>
    </li>
  );
}

function Panel({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`sticker p-5 sm:p-6 ${className}`}>
      <h2 className="hat mb-4">{title}</h2>
      {children}
    </section>
  );
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default async function ProjectDetailPage({
  params,
}: PageProps<"/projetos/[slug]">) {
  const { slug } = await params;
  const project = await getPublicSubmissionBySlug(slug);
  if (!project) notFound();

  const proofLink =
    project.proof_type === "app_url" ? safeHttpsUrl(project.proof_value) : null;
  const demoLink = safeHttpsUrl(project.demo_video_url);
  const number = String(project.number).padStart(4, "0");

  return (
    <>
      <Section tone="deep" padding="sm">
        <div className="flex max-w-4xl flex-col gap-5">
          <Link
            href="/projetos"
            className="pill w-fit border-ink/30 text-muted hover:text-ink"
          >
            {projectDetail.backArrow} {projectDetail.back}
          </Link>
          <Eyebrow>
            {projectDetail.eyebrow} · {projectDetail.number} {number}
          </Eyebrow>
          <h1 className="u-display break-words text-4xl sm:text-5xl lg:text-6xl">
            {project.project_name}
          </h1>
          <p className="max-w-3xl text-lg font-semibold leading-snug text-ink-soft sm:text-xl">
            {project.tagline}
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge tone="emerald">{categoryLabels[project.category]}</Badge>
            <Badge tone="neutral">
              {projectDetail.tech}: {techLabels[project.tech]}
            </Badge>
            {project.team_name ? (
              <Badge tone="neutral">
                {projectDetail.team}: {project.team_name}
              </Badge>
            ) : null}
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr] lg:items-start">
          <div className="flex min-w-0 flex-col gap-6">
            <section className="card-cut p-6 sm:p-8">
              <h2 className="hat mb-4">{projectDetail.writeup}</h2>
              <p className="whitespace-pre-line text-base leading-relaxed text-ink sm:text-lg">
                {project.writeup}
              </p>
            </section>

            <Panel title={projectDetail.changes}>
              <p className="whitespace-pre-line text-base leading-relaxed text-ink-soft">
                {project.sprint_changes}
              </p>
            </Panel>

            <div className="grid gap-6 sm:grid-cols-2">
              <Panel title={projectDetail.proof}>
                <p className="mb-3 text-sm font-semibold">
                  {projectDetail.proofTypes[project.proof_type]}
                </p>
                {proofLink ? (
                  <a
                    href={proofLink}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-start gap-2 [overflow-wrap:anywhere] text-sm font-semibold text-emerald-deep underline-offset-4 hover:underline"
                  >
                    <span>{breakable(project.proof_value)}</span>
                    <ArrowOut />
                  </a>
                ) : (
                  <code className="block [overflow-wrap:anywhere] border-2 border-ink/15 bg-surface px-3 py-2 font-mono text-xs leading-relaxed">
                    {project.proof_value}
                  </code>
                )}
              </Panel>

              <Panel title={projectDetail.demo}>
                {demoLink ? (
                  <a
                    href={demoLink}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-start gap-2 [overflow-wrap:anywhere] text-sm font-semibold text-emerald-deep underline-offset-4 hover:underline"
                  >
                    <span>{breakable(project.demo_video_url)}</span>
                    <ArrowOut />
                  </a>
                ) : (
                  <p className="text-sm text-muted">—</p>
                )}
              </Panel>
            </div>
          </div>

          <aside className="flex flex-col gap-6">
            <Panel title={projectDetail.links}>
              <ul className="flex flex-col divide-y-2 divide-ink/10">
                <LinkRow label={projectDetail.repository} value={project.repo_url} />
                <LinkRow label={projectDetail.projectPage} value={project.colosseum_url} />
                <LinkRow label={projectDetail.website} value={project.website_url} />
              </ul>
            </Panel>

            {project.members.length > 0 ? (
              <Panel title={projectDetail.members}>
                <ul className="flex flex-col gap-4">
                  {project.members.map((member, index) => (
                    <li key={`${member.name}-${index}`} className="flex gap-3">
                      <span
                        aria-hidden
                        className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-ink bg-yellow font-display text-sm font-black"
                      >
                        {initials(member.name)}
                      </span>
                      <div className="flex min-w-0 flex-col gap-1">
                        <span className="font-semibold">{member.name}</span>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
                          {member.x ? (
                            <a
                              href={`https://x.com/${encodeURIComponent(member.x.replace(/^@/, ""))}`}
                              target="_blank"
                              rel="noopener noreferrer nofollow"
                              className="font-semibold text-emerald-deep underline-offset-4 hover:underline"
                            >
                              {projectDetail.x}: {member.x}
                            </a>
                          ) : null}
                          {member.github ? (
                            <a
                              href={`https://github.com/${encodeURIComponent(member.github.replace(/^@/, ""))}`}
                              target="_blank"
                              rel="noopener noreferrer nofollow"
                              className="font-semibold text-emerald-deep underline-offset-4 hover:underline"
                            >
                              {projectDetail.github}: {member.github}
                            </a>
                          ) : null}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </Panel>
            ) : null}
          </aside>
        </div>
      </Section>
    </>
  );
}
