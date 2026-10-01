import { notFound } from "next/navigation";

import { Badge } from "@/components/badge";
import { CutLink } from "@/components/cut-button";
import { Eyebrow } from "@/components/eyebrow";
import { Section } from "@/components/section";
import { SubmissionAside } from "@/components/submission-aside";
import { SubmissionForm } from "@/components/submission-form";
import { editPage } from "@/content/form";
import { cta, site } from "@/content/site";
import { getSubmissionByEditTokenHash, rowToFormValues } from "@/lib/db/submissions";
import { hashEditToken } from "@/lib/tokens";
import { getWindowState } from "@/lib/window";

import { updateSubmissionAction } from "../../enviar/actions";

export default async function EditarPage(props: PageProps<"/editar/[token]">) {
  const { token } = await props.params;
  const row = await getSubmissionByEditTokenHash(hashEditToken(token));

  if (!row) {
    notFound();
  }

  const windowState = getWindowState();
  const action = updateSubmissionAction.bind(null, token);
  const isOpen = windowState === "open";

  return (
    <>
      <Section tone="deep" padding="sm">
        <div className="flex max-w-3xl flex-col gap-4">
          <Eyebrow>{site.challengeName}</Eyebrow>
          <h1 className="u-display text-4xl sm:text-5xl">{editPage.title}</h1>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="ink">Nº {String(row.number).padStart(4, "0")}</Badge>
            <span className="font-display text-lg font-black">{row.project_name}</span>
          </div>
          {isOpen ? (
            <p className="max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              {editPage.subtitle}
            </p>
          ) : (
            <p className="border-l-4 border-danger pl-3 text-base font-semibold text-danger">
              {editPage.closedMessage}
            </p>
          )}
        </div>
      </Section>
      <Section>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start">
          <div className="min-w-0 max-w-3xl">
          {isOpen ? (
            <SubmissionForm
              action={action}
              initialValues={rowToFormValues(row)}
              submitLabel={editPage.submit}
            />
          ) : (
            <div className="flex flex-wrap gap-3">
              <CutLink href={`/projetos/${row.slug}`} variant="primary">
                {cta.viewProjects}
              </CutLink>
              <CutLink href="/" variant="outline">
                {cta.backHome}
              </CutLink>
            </div>
          )}
          </div>
          {isOpen ? <SubmissionAside /> : null}
        </div>
      </Section>
    </>
  );
}
