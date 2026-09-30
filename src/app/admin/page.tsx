import Link from "next/link";

import { Section } from "@/components/section";
import { admin } from "@/content/admin";
import { categoryLabels, payoutStatusLabels, prizePoolLabels, statusLabels, techLabels } from "@/content/labels";
import { getWinnerCounts, listAdminSubmissions, type AdminFilters } from "@/lib/db/submissions";
import { aggregateScores, getAllScores } from "@/lib/db/judging";
import { formatShortBRT } from "@/lib/window";
import { requireAdmin } from "@/lib/admin-auth";
import { CATEGORIES, TECHS, type Category, type Tech } from "@/lib/validation";

export const dynamic = "force-dynamic";

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function filterEnum<T extends string>(value: string | undefined, values: readonly T[]): T | undefined {
  return value && values.includes(value as T) ? (value as T) : undefined;
}

export default async function AdminPage({
  searchParams,
}: PageProps<"/admin">) {
  await requireAdmin();
  const params = await searchParams;
  const filters: AdminFilters = {
    category: filterEnum<Category>(first(params.category), CATEGORIES),
    tech: filterEnum<Tech>(first(params.tech), TECHS),
    status: filterEnum(first(params.status), ["submitted", "hidden", "disqualified"] as const),
  };
  const [submissions, scores, winners] = await Promise.all([
    listAdminSubmissions(filters),
    getAllScores(),
    getWinnerCounts(),
  ]);
  const aggregates = aggregateScores(scores);

  return (
    <Section>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
        <div className="flex flex-col gap-3">
          <p className="u-mono text-emerald">{admin.title}</p>
          <h1 className="text-3xl uppercase sm:text-4xl">{admin.listTitle}</h1>
          <p className="max-w-2xl text-sm text-muted">{admin.intro}</p>
        </div>
        <p className="cut-corner-sm bg-surface-raised px-4 py-3 font-display text-sm font-extrabold">
          {admin.winners.counter(winners.cloak, winners.zcash)}
          {winners.cloak > 5 ? <span className="ml-3 text-danger">{admin.winners.over("Cloak")}</span> : null}
          {winners.zcash > 5 ? <span className="ml-3 text-danger">{admin.winners.over("Zcash")}</span> : null}
        </p>
      </div>

      <form action="/admin" method="get" className="mb-8 grid gap-4 border-y border-ink/15 py-5 sm:grid-cols-4">
        <label className="flex flex-col gap-2 text-sm font-semibold">
          {admin.filters.category}
          <select name="category" defaultValue={filters.category ?? ""} className="min-h-11 border border-ink/20 bg-surface-raised px-3">
            <option value="">{admin.filters.all}</option>
            {CATEGORIES.map((value) => <option key={value} value={value}>{categoryLabels[value]}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold">
          {admin.filters.tech}
          <select name="tech" defaultValue={filters.tech ?? ""} className="min-h-11 border border-ink/20 bg-surface-raised px-3">
            <option value="">{admin.filters.all}</option>
            {TECHS.map((value) => <option key={value} value={value}>{techLabels[value]}</option>)}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold">
          {admin.filters.status}
          <select name="status" defaultValue={filters.status ?? ""} className="min-h-11 border border-ink/20 bg-surface-raised px-3">
            <option value="">{admin.filters.all}</option>
            {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <div className="flex items-end gap-3">
          <button className="cut-corner-sm min-h-11 bg-emerald px-4 font-display text-sm font-extrabold uppercase text-surface-raised" type="submit">{admin.actions.applyFilters}</button>
          <Link href="/admin" className="pb-3 text-sm underline underline-offset-4">{admin.filters.clear}</Link>
        </div>
      </form>

      <div className="overflow-x-auto border border-ink/15 bg-surface-raised">
        <table className="w-full min-w-[1100px] border-collapse text-left text-sm">
          <thead className="bg-surface-deep">
            <tr>
              {Object.values(admin.columns).map((column) => <th key={column} scope="col" className="whitespace-nowrap px-3 py-3 font-display text-xs font-extrabold uppercase">{column}</th>)}
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => {
              const aggregate = aggregates.get(submission.id);
              return (
                <tr key={submission.id} className="border-t border-ink/10 align-top">
                  <td className="px-3 py-3 font-mono">{`Nº ${String(submission.number).padStart(4, "0")}`}</td>
                  <td className="px-3 py-3"><Link href={`/admin/${submission.id}`} className="font-semibold underline underline-offset-4">{submission.project_name}</Link></td>
                  <td className="px-3 py-3">{submission.team_name || admin.fields.none}</td>
                  <td className="px-3 py-3">{categoryLabels[submission.category as Category]}</td>
                  <td className="px-3 py-3">{techLabels[submission.tech as Tech]}</td>
                  <td className="whitespace-nowrap px-3 py-3">{formatShortBRT(new Date(submission.created_at))}</td>
                  <td className="whitespace-nowrap px-3 py-3">{formatShortBRT(new Date(submission.updated_at))}</td>
                  <td className="px-3 py-3">{statusLabels[submission.status as keyof typeof statusLabels]}</td>
                  <td className="px-3 py-3">{aggregate?.weighted === null || aggregate?.weighted === undefined ? admin.judging.noScores : aggregate.weighted.toFixed(2)}</td>
                  <td className="px-3 py-3">{aggregate?.judges ?? 0}</td>
                  <td className="px-3 py-3">{submission.is_winner ? admin.fields.winnerYes : admin.fields.winnerNo}</td>
                  <td className="px-3 py-3">{submission.prize_pool ? prizePoolLabels[submission.prize_pool as keyof typeof prizePoolLabels] : admin.fields.none}</td>
                  <td className="px-3 py-3">{payoutStatusLabels[submission.payout_status as keyof typeof payoutStatusLabels]}</td>
                </tr>
              );
            })}
            {submissions.length === 0 ? <tr><td className="px-4 py-8 text-muted" colSpan={13}>{admin.empty}</td></tr> : null}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
