import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { CopyButton } from "@/components/copy-button";
import { CutLink } from "@/components/cut-button";
import { ClearSuccessCookie } from "@/components/clear-success-cookie";
import { Eyebrow } from "@/components/eyebrow";
import { Section } from "@/components/section";
import { TicketCard } from "@/components/ticket";
import { successPage } from "@/content/form";
import { site } from "@/content/site";
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
  const serial = `Nº ${String(submission.number).padStart(4, "0")}`;

  return (
    <Section tone="deep" padding="lg">
      <ClearSuccessCookie />
      <div className="mx-auto flex max-w-2xl flex-col gap-8">
        <div className="flex flex-col gap-4">
          <Eyebrow>{site.challengeName}</Eyebrow>
          <h1 className="u-display text-4xl sm:text-5xl">{successPage.title}</h1>
          <p className="text-base leading-relaxed text-muted sm:text-lg">
            {successPage.subtitle}
          </p>
        </div>

        <TicketCard
          header={successPage.ticketLabel}
          serial={serial}
          fields={[
            { label: "Projeto", value: submission.project_name },
            {
              label: successPage.editLinkLabel,
              value: (
                <code className="block break-all border-2 border-ink/15 bg-surface px-3 py-2 font-mono text-sm font-medium leading-relaxed">
                  {link}
                </code>
              ),
            },
          ]}
          footer={
            <div className="flex flex-col gap-4">
              <p className="border-l-4 border-danger pl-3 text-sm font-semibold text-danger">
                {successPage.editLinkWarning}
              </p>
              <div className="flex flex-wrap gap-3">
                <CopyButton value={link} label={successPage.copy} copiedLabel={successPage.copied} />
                <CutLink href="/projetos" variant="outline">
                  {successPage.viewProjects}
                </CutLink>
                <CutLink href="/" variant="outline">
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
