import { connection } from "next/server";

import { Eyebrow } from "@/components/eyebrow";
import { Section } from "@/components/section";
import { closedPage, submissionForm } from "@/content/form";
import { emptySubmissionValues } from "@/lib/validation";
import { getWindowState } from "@/lib/window";

import { createSubmissionAction } from "./actions";
import { SubmissionForm } from "@/components/submission-form";

export default async function EnviarPage() {
  await connection();
  const windowState = getWindowState();

  if (windowState !== "open") {
    const isBefore = windowState === "before";
    return (
      <Section>
        <div className="flex max-w-2xl flex-col gap-4">
          <Eyebrow>{submissionForm.title}</Eyebrow>
          <h1 className="text-3xl uppercase sm:text-4xl">
            {isBefore ? closedPage.beforeTitle : closedPage.closedTitle}
          </h1>
          <p className="text-base text-muted">
            {isBefore ? closedPage.beforeBody : closedPage.closedBody}
          </p>
        </div>
      </Section>
    );
  }

  return (
    <Section>
      <div className="flex max-w-3xl flex-col gap-4">
        <Eyebrow>{submissionForm.title}</Eyebrow>
        <h1 className="text-3xl uppercase sm:text-4xl">{submissionForm.title}</h1>
        <p className="text-base text-muted">{submissionForm.intro}</p>
      </div>
      <div className="mt-10 max-w-3xl">
        <SubmissionForm
          action={createSubmissionAction}
          initialValues={emptySubmissionValues()}
          submitLabel={submissionForm.submit}
        />
      </div>
    </Section>
  );
}
