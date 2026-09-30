import { Eyebrow } from "@/components/eyebrow";
import { Section } from "@/components/section";
import { projectDetail } from "@/content/projects";

export default function ProjectNotFound() {
  return (
    <Section>
      <div className="flex max-w-2xl flex-col gap-4">
        <Eyebrow>{projectDetail.eyebrow}</Eyebrow>
        <h1 className="text-3xl uppercase sm:text-4xl">{projectDetail.notFoundTitle}</h1>
        <p className="text-base text-muted">{projectDetail.notFoundBody}</p>
      </div>
    </Section>
  );
}
