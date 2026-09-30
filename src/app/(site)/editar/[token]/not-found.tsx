import { Eyebrow } from "@/components/eyebrow";
import { Section } from "@/components/section";
import { editPage } from "@/content/form";

export default function EditarNotFound() {
  return (
    <Section>
      <div className="flex max-w-2xl flex-col gap-4">
        <Eyebrow>{editPage.title}</Eyebrow>
        <h1 className="text-3xl uppercase sm:text-4xl">{editPage.notFoundTitle}</h1>
        <p className="text-base text-muted">{editPage.notFoundBody}</p>
      </div>
    </Section>
  );
}
