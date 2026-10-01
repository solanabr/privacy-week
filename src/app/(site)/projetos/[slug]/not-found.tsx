import { CutLink } from "@/components/cut-button";
import { Eyebrow } from "@/components/eyebrow";
import { Section } from "@/components/section";
import { projectDetail } from "@/content/projects";
import { cta } from "@/content/site";

export default function ProjectNotFound() {
  return (
    <Section tone="deep" padding="lg">
      <div className="sticker mx-auto flex max-w-2xl flex-col gap-5 p-7 sm:p-10">
        <Eyebrow>{projectDetail.eyebrow}</Eyebrow>
        <h1 className="u-display text-3xl sm:text-4xl">{projectDetail.notFoundTitle}</h1>
        <p className="text-base leading-relaxed text-muted sm:text-lg">{projectDetail.notFoundBody}</p>
        <div className="flex flex-wrap gap-3">
          <CutLink href="/projetos" variant="primary">{cta.viewProjects}</CutLink>
          <CutLink href="/" variant="outline">{cta.backHome}</CutLink>
        </div>
      </div>
    </Section>
  );
}
