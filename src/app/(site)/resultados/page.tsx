import { notFound } from "next/navigation";

import { Badge } from "@/components/badge";
import { Eyebrow } from "@/components/eyebrow";
import { ProjectCard } from "@/components/project-card";
import { Section, SectionHeading } from "@/components/section";
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
      <Section tone="dots" padding="sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex max-w-3xl flex-col gap-4">
            <Eyebrow>{resultsPage.eyebrow}</Eyebrow>
            <h1 className="u-display text-4xl sm:text-5xl lg:text-6xl">
              {resultsPage.title}
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              {resultsPage.intro}
            </p>
          </div>
          <Badge tone="yellow">{resultsPage.prize}</Badge>
        </div>
      </Section>
      {winners.length === 0 ? (
        <Section>
          <p className="sticker mx-auto max-w-2xl p-8 text-center text-muted">
            {resultsPage.empty}
          </p>
        </Section>
      ) : (
        <>
          <ResultsGroup number="01" title={resultsPage.cloak} projects={cloakWinners} />
          <ResultsGroup
            number="02"
            title={resultsPage.zcash}
            projects={zcashWinners}
            tone="deep"
          />
        </>
      )}
    </>
  );
}

function ResultsGroup({
  number,
  title,
  projects,
  tone = "surface",
}: {
  number: string;
  title: string;
  projects: Awaited<ReturnType<typeof listPublicSubmissions>>;
  tone?: "surface" | "deep";
}) {
  return (
    <Section tone={tone}>
      <SectionHeading number={number} eyebrow={resultsPage.eyebrow} title={title} />
      {projects.length > 0 ? (
        <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} prize={resultsPage.prize} />
          ))}
        </ul>
      ) : (
        <p className="text-muted">{resultsPage.empty}</p>
      )}
    </Section>
  );
}
