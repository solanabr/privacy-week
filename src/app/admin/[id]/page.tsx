import { notFound } from "next/navigation";

import { Eyebrow } from "@/components/eyebrow";
import { Section } from "@/components/section";
import { admin } from "@/content/admin";
import { categoryLabels, payoutStatusLabels, prizePoolLabels, proofTypeLabels, statusLabels, techLabels } from "@/content/labels";
import { listScoresForSubmission, getJudgeScore, type ScoreInput } from "@/lib/db/judging";
import { getAdminSubmission } from "@/lib/db/submissions";
import { requireAdmin } from "@/lib/admin-auth";
import { safeHttpsUrl } from "@/lib/safe-url";
import { formatShortBRT } from "@/lib/window";
import { parseMembers } from "@/lib/db/submissions";
import { saveAdminNotesAction, saveJudgeScoreAction, savePayoutAction, saveStatusAction, saveWinnerAction } from "../actions";

const SCORE_KEYS = [
  "privacy_impact",
  "execution",
  "project_fit",
  "ux_presentation",
] as const satisfies readonly (keyof ScoreInput)[];

export const dynamic = "force-dynamic";

export default async function AdminDetailPage({
  params,
}: PageProps<"/admin/[id]">) {
  const { id } = await params;
  const judge = await requireAdmin();
  const submission = await getAdminSubmission(id);
  if (!submission) notFound();

  const [scores, ownScore] = await Promise.all([
    listScoresForSubmission(id),
    getJudgeScore(id, judge),
  ]);
  const members = parseMembers(submission.members);

  return (
    <Section>
      <div className="mb-8 flex flex-col gap-3">
        <Eyebrow>{admin.title} · Nº {String(submission.number).padStart(4, "0")}</Eyebrow>
        <h1 className="break-words text-3xl uppercase sm:text-4xl">{submission.project_name}</h1>
        <p className="max-w-3xl text-base text-muted">{submission.tagline}</p>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1fr_0.8fr]">
        <div className="flex min-w-0 flex-col gap-8">
          <section className="cut-corner-one border border-ink/15 bg-surface-raised p-5 sm:p-7">
            <h2 className="u-mono mb-5 text-emerald">{admin.fields.detail}</h2>
            <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
              <DataField label={admin.fields.number} value={`Nº ${String(submission.number).padStart(4, "0")}`} />
              <DataField label={admin.fields.slug} value={submission.slug} />
              <DataField label={admin.fields.project} value={submission.project_name} />
              <DataField label={admin.fields.team} value={submission.team_name ?? admin.fields.none} />
              <DataField label={admin.fields.category} value={categoryLabels[submission.category as keyof typeof categoryLabels]} />
              <DataField label={admin.fields.tech} value={techLabels[submission.tech as keyof typeof techLabels]} />
              <DataField label={admin.fields.repository} value={submission.repo_url} link />
              <DataField label={admin.fields.changes} value={submission.sprint_changes} />
              <DataField label={admin.fields.proof} value={`${proofTypeLabels[submission.proof_type as keyof typeof proofTypeLabels]} · ${submission.proof_value}`} />
              <DataField label={admin.fields.demo} value={submission.demo_video_url} link />
              <DataField label={admin.fields.writeup} value={submission.writeup} />
              <DataField label={admin.fields.colosseum} value={submission.colosseum_url ?? admin.fields.none} link />
              <DataField label={admin.fields.website} value={submission.website_url ?? admin.fields.none} link />
              <DataField label={admin.fields.members} value={members.map((member) => [member.name, member.x, member.github].filter(Boolean).join(" · ")).join("; ") || admin.fields.none} />
              <DataField label={admin.fields.xAccount} value={submission.x_username ? `@${submission.x_username} (${submission.x_user_id})` : admin.fields.none} />
              <DataField label={admin.fields.contactName} value={submission.contact_name} />
              <DataField label={admin.fields.contactEmail} value={submission.contact_email} />
              <DataField label={admin.fields.contactTelegram} value={submission.contact_telegram ?? admin.fields.none} />
              <DataField label={admin.fields.contactWhatsApp} value={submission.contact_whatsapp ?? admin.fields.none} />
              <DataField label={admin.fields.acceptedRules} value={submission.accepted_rules ? admin.fields.winnerYes : admin.fields.winnerNo} />
              <DataField label={admin.fields.created} value={formatShortBRT(new Date(submission.created_at))} />
              <DataField label={admin.fields.updated} value={formatShortBRT(new Date(submission.updated_at))} />
              <DataField label={admin.fields.status} value={statusLabels[submission.status as keyof typeof statusLabels]} />
              <DataField label={admin.fields.winner} value={submission.is_winner ? admin.fields.winnerYes : admin.fields.winnerNo} />
              <DataField label={admin.fields.payout} value={payoutStatusLabels[submission.payout_status as keyof typeof payoutStatusLabels]} />
            </dl>
          </section>

          <section className="cut-corner-one border border-ink/15 bg-surface-raised p-5 sm:p-7">
            <h2 className="u-mono mb-5 text-emerald">{admin.judging.title}</h2>
            <form action={saveJudgeScoreAction.bind(null, id)} className="flex flex-col gap-5">
              {admin.judging.scoreCriteria.map((criterion, index) => {
                const key = SCORE_KEYS[index];
                const score = ownScore?.[key] ?? 0;
                return (
                  <label key={criterion.key} className="flex flex-col gap-2 border-b border-ink/10 pb-4">
                    <span className="flex flex-wrap justify-between gap-2 font-display font-extrabold">
                      {criterion.label}<span className="u-mono text-muted">{criterion.weight}</span>
                    </span>
                    <span className="text-sm text-muted">{criterion.guidance}</span>
                    <input name={criterion.key} type="number" min={0} max={10} step={1} defaultValue={score} required className="min-h-11 w-28 border border-ink/20 bg-white px-3" />
                  </label>
                );
              })}
              <label className="flex flex-col gap-2 text-sm font-semibold">
                {admin.fields.judgeNotes}
                <textarea name="notes" maxLength={2000} defaultValue={ownScore?.notes ?? ""} className="min-h-24 border border-ink/20 bg-white p-3" />
              </label>
              <button type="submit" className="cut-corner-sm min-h-11 self-start bg-emerald px-5 font-display text-sm font-extrabold uppercase text-surface-raised">{admin.actions.saveScore}</button>
            </form>
                    <h3 className="u-mono mb-3 mt-8">{admin.fields.scores}</h3>
            {scores.length > 0 ? (
              <ul className="flex flex-col gap-3">
                {scores.map((score) => (
                  <li key={score.id} className="border-t border-ink/10 pt-3 text-sm">
                    <p className="font-semibold">{score.judge} · {((score.privacy_impact * 0.3) + (score.execution * 0.3) + (score.project_fit * 0.2) + (score.ux_presentation * 0.2)).toFixed(2)} {admin.fields.scoreOutOfTen}</p>
                    <p className="text-muted">{score.privacy_impact} · {score.execution} · {score.project_fit} · {score.ux_presentation}</p>
                    {score.notes ? <p className="mt-1 whitespace-pre-line">{score.notes}</p> : null}
                  </li>
                ))}
              </ul>
            ) : <p className="text-sm text-muted">{admin.judging.noScores}</p>}
          </section>
        </div>

        <aside className="flex flex-col gap-6">
          <ActionPanel title={admin.fields.status}>
            <form action={saveStatusAction.bind(null, id)} className="flex flex-col gap-4">
              <label className="flex flex-col gap-2 text-sm font-semibold">
                {admin.fields.status}
                <select name="status" defaultValue={submission.status} className="min-h-11 border border-ink/20 bg-white px-3">
                  {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </label>
              <label className="flex flex-col gap-2 text-sm font-semibold">
                {admin.actions.disqualify}
                <textarea name="reason" className="min-h-20 border border-ink/20 bg-white p-3" placeholder={admin.fields.disqualifyReason} />
              </label>
              <button type="submit" className="cut-corner-sm min-h-11 bg-emerald px-5 font-display text-sm font-extrabold uppercase text-surface-raised">{admin.actions.saveModeration}</button>
            </form>
          </ActionPanel>

          <ActionPanel title={admin.fields.winner}>
            <form action={saveWinnerAction.bind(null, id)} className="flex flex-col gap-4">
              <label className="flex flex-col gap-2 text-sm font-semibold">
                {admin.fields.winner}
                <select name="is_winner" defaultValue={submission.is_winner ? "true" : "false"} className="min-h-11 border border-ink/20 bg-white px-3">
                  <option value="false">{admin.fields.winnerNo}</option>
                  <option value="true">{admin.fields.winnerYes}</option>
                </select>
              </label>
              <label className="flex flex-col gap-2 text-sm font-semibold">
                {admin.fields.prizePool}
                <select name="prize_pool" defaultValue={submission.prize_pool ?? ""} className="min-h-11 border border-ink/20 bg-white px-3">
                  <option value="">{admin.fields.selectPool}</option>
                  {Object.entries(prizePoolLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </label>
              <button type="submit" className="cut-corner-sm min-h-11 bg-emerald px-5 font-display text-sm font-extrabold uppercase text-surface-raised">{admin.actions.save}</button>
            </form>
          </ActionPanel>

          <ActionPanel title={admin.fields.payout}>
            <form action={savePayoutAction.bind(null, id)} className="flex flex-col gap-4">
              <p className="text-sm text-danger">{admin.fields.payoutWarning}</p>
              <label className="flex flex-col gap-2 text-sm font-semibold">
                {admin.fields.payoutStatus}
                <select name="payout_status" defaultValue={submission.payout_status} className="min-h-11 border border-ink/20 bg-white px-3">
                  {Object.entries(payoutStatusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </label>
              <button type="submit" className="cut-corner-sm min-h-11 bg-emerald px-5 font-display text-sm font-extrabold uppercase text-surface-raised">{admin.actions.savePayout}</button>
            </form>
          </ActionPanel>

          <ActionPanel title={admin.fields.adminNotes}>
            <form action={saveAdminNotesAction.bind(null, id)} className="flex flex-col gap-4">
              <textarea name="admin_notes" maxLength={5000} defaultValue={submission.admin_notes ?? ""} className="min-h-36 border border-ink/20 bg-white p-3" />
              <button type="submit" className="cut-corner-sm min-h-11 self-start bg-surface-kraft px-5 font-display text-sm font-extrabold uppercase text-ink">{admin.actions.save}</button>
            </form>
          </ActionPanel>
        </aside>
      </div>
    </Section>
  );
}

function DataField({
  label,
  value,
  link = false,
}: {
  label: string;
  value: string;
  link?: boolean;
}) {
  const href = link ? safeHttpsUrl(value) : null;
  return (
    <div className="min-w-0">
      <dt className="u-mono mb-1 text-muted">{label}</dt>
      <dd className="break-words whitespace-pre-line text-sm">
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer nofollow" className="text-green underline underline-offset-4">{value}</a>
        ) : value}
      </dd>
    </div>
  );
}

function ActionPanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="cut-corner-one border border-ink/15 bg-surface-raised p-5">
      <h2 className="u-mono mb-4 text-emerald">{title}</h2>
      {children}
    </section>
  );
}
