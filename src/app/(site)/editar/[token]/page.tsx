import { notFound } from "next/navigation";

import { SubmissionForm } from "@/components/submission-form";
import { Eyebrow } from "@/components/eyebrow";
import { Section } from "@/components/section";
import { editPage } from "@/content/form";
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

  return (
    <Section>
      <div className="flex max-w-3xl flex-col gap-4">
        <Eyebrow>{editPage.title}</Eyebrow>
        <h1 className="text-3xl uppercase sm:text-4xl">{editPage.title}</h1>
        <p className="text-base text-muted">
          {row.project_name} · Nº {String(row.number).padStart(4, "0")}
        </p>
        {windowState === "open" ? (
          <p className="text-base text-muted">{editPage.subtitle}</p>
        ) : (
          <p className="text-base font-semibold text-danger">
            As submissões estão encerradas. O formulário abaixo está desativado.
          </p>
        )}
      </div>
      <div className="mt-10 max-w-3xl">
        {windowState === "open" ? (
          <SubmissionForm
            action={action}
            initialValues={rowToFormValues(row)}
            submitLabel={editPage.submit}
          />
        ) : null}
      </div>
    </Section>
  );
}
