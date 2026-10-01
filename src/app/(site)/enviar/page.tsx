import { connection } from "next/server";

import { CutLink } from "@/components/cut-button";
import { Eyebrow } from "@/components/eyebrow";
import { Section } from "@/components/section";
import { closedPage, submissionForm } from "@/content/form";
import { cta, sectionIds, site } from "@/content/site";
import { emptySubmissionValues } from "@/lib/validation";
import { getWindowState } from "@/lib/window";
import { getConnectedXAccount } from "@/lib/x-oauth";

import { createSubmissionAction } from "./actions";
import { SubmissionAside } from "@/components/submission-aside";
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
      <Section tone="deep" padding="lg">
        <div className="sticker mx-auto flex max-w-2xl flex-col gap-5 p-7 sm:p-10">
          <Eyebrow>{site.challengeName}</Eyebrow>
          <h1 className="u-display text-3xl sm:text-4xl">
            {isBefore ? closedPage.beforeTitle : closedPage.closedTitle}
          </h1>
          <p className="text-base leading-relaxed text-muted sm:text-lg">
            {isBefore ? closedPage.beforeBody : closedPage.closedBody}
          </p>
          <div className="flex flex-wrap gap-3">
            {isBefore ? (
              <CutLink href={`/#${sectionIds.challenge}`} variant="primary">
                {cta.rules}
              </CutLink>
            ) : (
              <CutLink href="/projetos" variant="primary">
                {cta.viewProjects}
              </CutLink>
            )}
            <CutLink href="/" variant="outline">
              {cta.backHome}
            </CutLink>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <>
      <Section tone="deep" padding="sm">
        <div className="flex max-w-3xl flex-col gap-4">
          <Eyebrow>{site.challengeName}</Eyebrow>
          <h1 className="u-display text-4xl sm:text-5xl">{submissionForm.title}</h1>
          <p className="max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            {submissionForm.intro}
          </p>
        </div>
      </Section>
      <Section>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start">
          <div className="min-w-0 max-w-3xl">
            <SubmissionForm
              action={createSubmissionAction}
              initialValues={emptySubmissionValues()}
              submitLabel={submissionForm.submit}
              requireXAccount
              connectedXUsername={xAccount?.username ?? null}
              xConnectionError={xConnectionError}
            />
          </div>
          <SubmissionAside />
        </div>
      </Section>
    </>
  );
}
