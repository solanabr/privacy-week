import { notFound } from "next/navigation";

import { ProjectCard } from "@/components/project-card";
import { Eyebrow } from "@/components/eyebrow";
import { Section } from "@/components/section";
import { resultsPage } from "@/content/projects";
import { listPublicSubmissions } from "@/lib/db/submissions";

export const dynamic = "force-dynamic";

export default async function ResultsPage() {
  if (process.env.RESULTS_PUBLISHED !== "true") notFound();

  const submissions = await listPublicSubmissions();
  const winners = submissions.filter((submission) => submission.is_winner);
  const cloakWinners = winners.filter((submission) => submission.prize_pool === "cloak");
  const zcashWinners = winners.filter((submission) => submission.prize_pool === "zcash");

  return (
    <>
      <Section tone="deep">
        <div className="flex max-w-3xl flex-col gap-4">
          <Eyebrow>{resultsPage.eyebrow}</Eyebrow>
          <h1 className="text-4xl uppercase sm:text-5xl">{resultsPage.title}</h1>
          <p className="text-base text-muted">{resultsPage.intro}</p>
        </div>
      </Section>
      {winners.length === 0 ? (
        <Section>
          <p className="max-w-2xl border border-ink/15 bg-surface-raised p-6 text-muted">
            {resultsPage.empty}
          </p>
        </Section>
      ) : (
        <>
          <ResultsGroup title={resultsPage.cloak} projects={cloakWinners} />
          <ResultsGroup title={resultsPage.zcash} projects={zcashWinners} tone="deep" />
        </>
      )}
    </>
  );
}

function ResultsGroup({
  title,
  projects,
  tone = "surface",
}: {
  title: string;
  projects: Awaited<ReturnType<typeof listPublicSubmissions>>;
  tone?: "surface" | "deep";
}) {
  return (
    <Section tone={tone}>
      <h2 className="mb-8 text-3xl uppercase">{title}</h2>
      {projects.length > 0 ? (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <li key={project.slug} className="relative">
              <span className="absolute right-2 top-2 z-10 bg-yellow px-3 py-1 font-display text-xs font-extrabold uppercase">
                {resultsPage.prize}
              </span>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted">{resultsPage.empty}</p>
      )}
    </Section>
  );
}
