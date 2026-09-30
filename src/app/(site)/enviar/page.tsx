import { connection } from "next/server";

import { Eyebrow } from "@/components/eyebrow";
import { Section } from "@/components/section";
import { closedPage, submissionForm } from "@/content/form";
import { emptySubmissionValues } from "@/lib/validation";
import { getWindowState } from "@/lib/window";
import { getConnectedXAccount } from "@/lib/x-oauth";

import { createSubmissionAction } from "./actions";
import { SubmissionForm } from "@/components/submission-form";

export default async function EnviarPage({
  searchParams,
}: PageProps<"/enviar">) {
  await connection();
  const [params, xAccount] = await Promise.all([
    searchParams,
    getConnectedXAccount(),
  ]);
  const windowState = getWindowState();
  const errorKey = Array.isArray(params.x_error)
    ? params.x_error[0]
    : params.x_error;
  const xConnectionError =
    errorKey === "not_configured"
      ? submissionForm.xConnection.notConfigured
      : errorKey === "denied"
        ? submissionForm.xConnection.denied
        : errorKey === "invalid_state"
          ? submissionForm.xConnection.invalidState
          : errorKey === "failed"
            ? submissionForm.xConnection.failed
            : null;

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
          requireXAccount
          connectedXUsername={xAccount?.username ?? null}
          xConnectionError={xConnectionError}
        />
      </div>
    </Section>
  );
}
