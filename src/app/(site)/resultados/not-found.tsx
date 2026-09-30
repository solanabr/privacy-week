import { Eyebrow } from "@/components/eyebrow";
import { Section } from "@/components/section";
import { resultsPage } from "@/content/projects";

export default function ResultsNotFound() {
  return (
    <Section>
      <div className="flex max-w-2xl flex-col gap-4">
        <Eyebrow>{resultsPage.eyebrow}</Eyebrow>
        <h1 className="text-3xl uppercase sm:text-4xl">{resultsPage.unavailableTitle}</h1>
        <p className="text-base text-muted">{resultsPage.unpublished}</p>
      </div>
    </Section>
  );
}
