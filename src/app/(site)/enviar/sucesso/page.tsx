import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { CopyButton } from "@/components/copy-button";
import { CutLink } from "@/components/cut-button";
import { ClearSuccessCookie } from "@/components/clear-success-cookie";
import { Eyebrow } from "@/components/eyebrow";
import { Section } from "@/components/section";
import { TicketCard } from "@/components/ticket";
import { successPage } from "@/content/form";
import { FLASH_COOKIE } from "@/lib/form-state";
import { getSubmissionByEditTokenHash } from "@/lib/db/submissions";
import { hashEditToken } from "@/lib/tokens";
import { editUrl } from "@/lib/site-url";

export default async function SucessoPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(FLASH_COOKIE)?.value;

  if (!token) {
    redirect("/");
  }

  const submission = await getSubmissionByEditTokenHash(hashEditToken(token));
  if (!submission) redirect("/");

  const link = editUrl(token);

  return (
    <Section>
      <ClearSuccessCookie />
      <div className="flex max-w-2xl flex-col gap-4">
        <Eyebrow>{successPage.title}</Eyebrow>
        <h1 className="text-3xl uppercase sm:text-4xl">{successPage.title}</h1>
        <p className="text-base text-muted">{successPage.subtitle}</p>
      </div>

      <div className="mt-8 max-w-2xl">
        <TicketCard
          header={successPage.ticketLabel}
          serial={`Nº ${String(submission.number).padStart(4, "0")}`}
          fields={[{ label: successPage.editLinkLabel, value: link }]}
          footer={
            <div className="flex flex-col gap-4">
              <p className="text-sm font-semibold text-danger">
                {successPage.editLinkWarning}
              </p>
              <div className="flex flex-wrap gap-3">
                <CopyButton value={link} label={successPage.copy} copiedLabel={successPage.copied} />
                <CutLink href="/projetos" variant="secondary">
                  {successPage.viewProjects}
                </CutLink>
                <CutLink href="/" variant="secondary">
                  {successPage.backHome}
                </CutLink>
              </div>
            </div>
          }
        />
      </div>
    </Section>
  );
}
