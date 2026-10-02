import Link from "next/link";

import { AutoRefresh } from "@/components/admin/auto-refresh";
import { BarList } from "@/components/admin/bar-list";
import { ColumnChart } from "@/components/admin/column-chart";
import { Meter } from "@/components/admin/meter";
import { StatTile } from "@/components/admin/stat-tile";
import { Badge } from "@/components/badge";
import { CutLink } from "@/components/cut-button";
import { Eyebrow } from "@/components/eyebrow";
import { Section } from "@/components/section";
import { admin } from "@/content/admin";
import {
  categoryLabels,
  payoutStatusLabels,
  prizePoolLabels,
  proofTypeLabels,
  statusLabels,
  techLabels,
} from "@/content/labels";
import { requireAdmin } from "@/lib/admin-auth";
import { getJudgeNames } from "@/lib/auth";
import { buildDashboard, dayKey, type LeaderboardRow } from "@/lib/dashboard";
import { getAllScores } from "@/lib/db/judging";
import { listAdminSubmissions } from "@/lib/db/submissions";
import { formatClockBRT, formatShortBRT, getNow, getSubmissionWindow } from "@/lib/window";
import type { Category, ProofType, Tech } from "@/lib/validation";

export const dynamic = "force-dynamic";

const REFRESH_SECONDS = 30;
const copy = admin.dashboard;

function Panel({
  title,
  note,
  children,
  className = "",
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`sticker flex min-w-0 flex-col gap-4 p-5 sm:p-6 ${className}`}>
      <div className="flex flex-col gap-1">
        <h2 className="hat">{title}</h2>
        {note ? <p className="text-xs text-muted">{note}</p> : null}
      </div>
      {children}
    </section>
  );
}

function score(value: number | null): string {
  return value === null ? "—" : value.toFixed(2);
}

function StatusChip({ status }: { status: string }) {
  const tone = status === "submitted" ? "emerald" : status === "hidden" ? "neutral" : "ink";
  return <Badge tone={tone}>{statusLabels[status as keyof typeof statusLabels] ?? status}</Badge>;
}

function ProjectLink({ row }: { row: LeaderboardRow }) {
  return (
    <Link href={`/admin/${row.id}`} className="font-semibold underline-offset-4 hover:underline">
      {row.project_name}
    </Link>
  );
}

export default async function AdminDashboardPage() {
  await requireAdmin();
  const [submissions, scores] = await Promise.all([
    listAdminSubmissions(),
    getAllScores(),
  ]);
  const now = getNow();
  const stats = buildDashboard(submissions, scores, {
    now,
    window: getSubmissionWindow(),
    judges: getJudgeNames(),
  });
  const judgingShare = stats.judging.total
    ? Math.round((stats.judging.scored / stats.judging.total) * 100)
    : 0;

  return (
    <Section padding="sm">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex max-w-2xl flex-col gap-3">
          <Eyebrow>{admin.title}</Eyebrow>
          <h1 className="u-display text-4xl sm:text-5xl">{copy.title}</h1>
          <p className="text-sm leading-relaxed text-muted sm:text-base">{copy.intro}</p>
        </div>
        <div className="flex flex-col items-start gap-3 lg:items-end">
          <AutoRefresh
            seconds={REFRESH_SECONDS}
            updatedAt={formatClockBRT(now)}
            labels={{
              updatedAt: copy.updatedAt,
              auto: copy.autoRefresh(REFRESH_SECONDS),
              refresh: copy.refresh,
            }}
          />
          <CutLink href="/admin" variant="outline" size="sm">
            {copy.viewAll}
          </CutLink>
        </div>
      </div>

      {/* Headline numbers */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label={copy.tiles.total} value={stats.total} lead tone="yellow" />
        <StatTile label={copy.tiles.public} value={stats.byStatus.submitted} />
        <StatTile label={copy.tiles.hidden} value={stats.byStatus.hidden} />
        <StatTile label={copy.tiles.disqualified} value={stats.byStatus.disqualified} />
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label={copy.tiles.last24h} value={stats.last24h} />
        <StatTile label={copy.tiles.members} value={stats.membersTotal} />
        <StatTile
          label={copy.tiles.scored}
          value={`${stats.judging.scored}/${stats.judging.total}`}
          detail={`${judgingShare}% · ${copy.publicOnly}`}
        />
        <StatTile
          label={copy.tiles.averageScore}
          value={score(stats.judging.averageWeighted)}
          detail={stats.judging.averageWeighted === null ? copy.noScores : copy.outOfTen.trim()}
        />
      </div>

      {/* Over time + winners/payouts */}
      <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-[2fr_1fr]">
        <Panel title={copy.sections.perDay} note={copy.sections.perDayNote}>
          <ColumnChart data={stats.perDay} highlightKey={dayKey(now)} />
        </Panel>
        <div className="flex flex-col gap-6">
          <Panel title={copy.sections.winners}>
            <dl className="grid grid-cols-2 gap-4">
              {(["cloak", "zcash"] as const).map((pool) => (
                <div key={pool} className="flex flex-col gap-1">
                  <dt className="u-mono text-muted">{prizePoolLabels[pool]}</dt>
                  <dd className="text-3xl font-semibold leading-none">
                    {stats.winners[pool]}
                    <span className="ml-1 text-sm font-normal text-muted">
                      / {stats.winners.cap}
                    </span>
                  </dd>
                  <Meter
                    compact
                    label={prizePoolLabels[pool]}
                    value={stats.winners[pool]}
                    max={stats.winners.cap}
                  />
                </div>
              ))}
            </dl>
          </Panel>
          <Panel title={copy.sections.payouts}>
            <dl className="grid grid-cols-3 gap-3">
              {(["pending", "link_sent", "claimed"] as const).map((key) => (
                <div key={key} className="flex flex-col gap-1">
                  <dt className="u-mono text-muted">{payoutStatusLabels[key]}</dt>
                  <dd className="text-3xl font-semibold leading-none">{stats.payouts[key]}</dd>
                </div>
              ))}
            </dl>
          </Panel>
        </div>
      </div>

      {/* Breakdowns */}
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <Panel title={copy.sections.byCategory} note={copy.publicOnly}>
          <BarList
            emptyLabel={copy.noData}
            rows={stats.byCategory.map((row) => ({
              label: categoryLabels[row.key as Category] ?? row.key,
              count: row.count,
              share: row.share,
            }))}
          />
        </Panel>
        <Panel title={copy.sections.byTech} note={copy.publicOnly}>
          <BarList
            emptyLabel={copy.noData}
            rows={stats.byTech.map((row) => ({
              label: techLabels[row.key as Tech] ?? row.key,
              count: row.count,
              share: row.share,
            }))}
          />
        </Panel>
        <Panel title={copy.sections.byProof} note={copy.publicOnly}>
          <BarList
            emptyLabel={copy.noData}
            rows={stats.byProof.map((row) => ({
              label: proofTypeLabels[row.key as ProofType] ?? row.key,
              count: row.count,
              share: row.share,
            }))}
          />
        </Panel>
      </div>

      {/* Judging */}
      <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-[1fr_2fr]">
        <Panel title={copy.sections.judging}>
          <div className="flex flex-col gap-4">
            <div className="flex items-baseline justify-between gap-3">
              <span className="u-mono text-muted">{copy.tiles.fullyScored}</span>
              <span className="text-2xl font-semibold leading-none">
                {stats.judging.fullyScored}
                <span className="ml-1 text-sm font-normal text-muted">
                  / {stats.judging.total}
                </span>
              </span>
            </div>
            {stats.judging.perJudge.length > 0 ? (
              stats.judging.perJudge.map((judge) => (
                <Meter
                  key={judge.judge}
                  label={judge.judge}
                  value={judge.scored}
                  max={judge.total}
                  detail={copy.judgeProgress(judge.scored, judge.total)}
                />
              ))
            ) : (
              <p className="text-sm text-muted">{copy.noScores}</p>
            )}
          </div>
        </Panel>

        <Panel title={copy.sections.leaderboard} note={copy.sections.leaderboardNote}>
          {stats.leaderboard.length === 0 ? (
            <p className="text-sm text-muted">{copy.noData}</p>
          ) : (
            <div className="min-w-0 overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b-2 border-ink/15">
                    <th className="u-mono py-2 pr-3 text-muted" scope="col">{copy.columns.rank}</th>
                    <th className="u-mono py-2 pr-3 text-muted" scope="col">{copy.columns.project}</th>
                    <th className="u-mono py-2 pr-3 text-muted" scope="col">{copy.columns.category}</th>
                    <th className="u-mono py-2 pr-3 text-right text-muted" scope="col">{copy.columns.score}</th>
                    <th className="u-mono py-2 pr-3 text-right text-muted" scope="col">{copy.columns.judges}</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.leaderboard.map((row, index) => (
                    <tr key={row.id} className="border-b border-ink/10 align-middle">
                      <td className="py-2.5 pr-3 font-mono text-xs tabular-nums text-muted">
                        {index + 1}
                      </td>
                      <td className="py-2.5 pr-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <ProjectLink row={row} />
                          {row.is_winner ? (
                            <Badge tone="yellow">
                              {row.prize_pool
                                ? prizePoolLabels[row.prize_pool as keyof typeof prizePoolLabels]
                                : admin.fields.winner}
                            </Badge>
                          ) : null}
                        </div>
                        {row.team_name ? (
                          <p className="text-xs text-muted">{row.team_name}</p>
                        ) : null}
                      </td>
                      <td className="py-2.5 pr-3 text-xs text-muted">
                        {categoryLabels[row.category as Category] ?? row.category}
                        <span className="text-ink/40"> · </span>
                        {techLabels[row.tech as Tech] ?? row.tech}
                      </td>
                      <td className="py-2.5 pr-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span
                            aria-hidden
                            className="hidden h-2 w-16 bg-emerald/15 sm:block"
                          >
                            <span
                              className="block h-full rounded-r-[4px] bg-emerald"
                              style={{ width: `${((row.weighted ?? 0) / 10) * 100}%` }}
                            />
                          </span>
                          <span className="font-semibold tabular-nums">{score(row.weighted)}</span>
                        </div>
                      </td>
                      <td className="py-2.5 pr-3 text-right font-mono text-xs tabular-nums text-muted">
                        {row.judges}/{stats.judging.expectedJudges}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </div>

      {/* Latest */}
      <div className="mt-6">
        <Panel title={copy.sections.latest}>
          {stats.latest.length === 0 ? (
            <p className="text-sm text-muted">{copy.noData}</p>
          ) : (
            <ul className="flex flex-col divide-y divide-ink/10">
              {stats.latest.map((row) => (
                <li
                  key={row.id}
                  className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 flex-wrap items-center gap-3">
                    <span className="u-mono text-muted">
                      Nº {String(row.number).padStart(4, "0")}
                    </span>
                    <ProjectLink row={row} />
                    <StatusChip status={row.status} />
                  </div>
                  <span className="font-mono text-xs tabular-nums text-muted">
                    {formatShortBRT(new Date(row.created_at))}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </Section>
  );
}
