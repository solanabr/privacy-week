import Image from "next/image";
import type { CSSProperties } from "react";

import { Badge } from "@/components/badge";
import { CalendarTrack } from "@/components/calendar-track";
import { CopyButton } from "@/components/copy-button";
import { Countdown } from "@/components/countdown";
import { CutLink } from "@/components/cut-button";
import { Eyebrow } from "@/components/eyebrow";
import { FaqList } from "@/components/faq-list";
import { Redaction } from "@/components/redaction";
import { Section, SectionHeading } from "@/components/section";
import { ShieldedPoolDiagram } from "@/components/shielded-pool-diagram";
import { TicketCard } from "@/components/ticket";
import {
  calendar,
  challenge,
  closing,
  cloakSection,
  devWithCloak,
  faq,
  faqSection,
  finePrint,
  hero,
  howTo,
  ideas,
  judging,
  payout,
  requirements,
  resources,
  resourcesSection,
  results,
  whyPrivacy,
  type ResourceGroup,
} from "@/content/home";
import { cta, footer, sectionIds, site } from "@/content/site";
import { getNow, getSubmissionWindow, getWindowState } from "@/lib/window";

export const revalidate = 60;

function ExternalLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className={`font-semibold text-emerald-deep underline decoration-emerald/40 underline-offset-4 transition-colors hover:text-ink hover:decoration-ink ${className}`}
    >
      {children}
    </a>
  );
}

function ArrowOut() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      className="h-3.5 w-3.5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 12 12 4M6 4h6v6" />
    </svg>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3 text-sm leading-relaxed text-ink-soft sm:text-base">
      <span aria-hidden className="mt-2 h-2 w-2 shrink-0 bg-emerald" />
      <span>{children}</span>
    </li>
  );
}

function ResourceCard({ group }: { group: ResourceGroup }) {
  return (
    <div className="sticker flex flex-col p-5 sm:p-6">
      <h3 className="u-display border-b-2 border-ink/10 pb-4 text-2xl">{group.title}</h3>
      <ul className="flex flex-col divide-y-2 divide-ink/10">
        {group.items.map((item) => (
          <li key={item.href} className="py-3 text-sm">
            <ExternalLink
              href={item.href}
              className="inline-flex items-start gap-2 no-underline hover:underline"
            >
              <span>{item.label}</span>
              <ArrowOut />
            </ExternalLink>
            {item.note ? (
              <p className="mt-1 font-mono text-xs text-muted [overflow-wrap:anywhere]">
                {item.note}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

const WEIGHT_COLORS = ["bg-emerald", "bg-emerald-deep", "bg-yellow", "bg-ink/60"];

/** "PERÍODO: 30 SET…" under a "Período" label says it twice; drop the prefix. */
function withoutLabel(value: string, label: string): string {
  const prefix = `${label}:`.toLowerCase();
  return value.toLowerCase().startsWith(prefix)
    ? value.slice(prefix.length).trim()
    : value;
}

export default function HomePage() {
  const windowState = getWindowState();
  const isOpen = windowState === "open";
  const closeAt = getSubmissionWindow().closeAt.toISOString();
  const resultsPublished = process.env.RESULTS_PUBLISHED === "true";
  const now = getNow();

  const [headlineBefore, headlineAfter] = hero.headline.split(hero.highlight);
  const primaryHref = isOpen ? "/enviar" : "/projetos";
  const primaryLabel = isOpen ? cta.submit : cta.viewProjects;
  const cloakSponsor = footer.sponsors[0];

  return (
    <>
      {/* Hero */}
      <Section padding="none" className="paper">
        <div className="grid items-center gap-12 pb-12 pt-12 sm:pt-16 lg:grid-cols-[1.3fr_1fr] lg:gap-10 lg:pt-20">
          <div className="hero-print flex min-w-0 flex-col gap-6">
            <div style={{ "--hero-i": 0 } as CSSProperties}>
              <Eyebrow>{hero.eyebrow}</Eyebrow>
            </div>
            {/* Below lg the headline may fill the width; from lg the size is
                tied to the column share, or the longest word would widen the
                column and squeeze the ticket. */}
            <h1
              className="u-display text-[clamp(2rem,10.5vw,5.75rem)] lg:text-[clamp(3rem,5.4vw,5.75rem)]"
              style={{ "--hero-i": 1 } as CSSProperties}
            >
              {headlineBefore}
              <span className="hero-marca inline-block px-[0.12em]">
                {hero.highlight}
              </span>
              {headlineAfter}
            </h1>
            <p
              className="max-w-xl text-pretty text-lg leading-relaxed text-ink-soft sm:text-xl"
              style={{ "--hero-i": 2 } as CSSProperties}
            >
              {hero.sub}
            </p>
            <div
              className="flex flex-wrap gap-3"
              style={{ "--hero-i": 3 } as CSSProperties}
            >
              <CutLink href={primaryHref} variant="primary" size="lg">
                {primaryLabel}
              </CutLink>
              <CutLink href={`/#${sectionIds.challenge}`} variant="outline" size="lg">
                {cta.rules}
              </CutLink>
            </div>
          </div>

          <div className="hero-ticket w-full min-w-0 max-w-md justify-self-center lg:justify-self-end">
            <TicketCard
              rotate
              header={hero.ticket.header}
              serial={hero.ticket.serial}
              fields={[
                {
                  label: hero.ticket.labels.period,
                  value: withoutLabel(hero.ticket.period, hero.ticket.labels.period),
                },
                {
                  label: hero.ticket.labels.prizes,
                  value: (
                    <>
                      {withoutLabel(hero.ticket.prizes, hero.ticket.labels.prizes)}
                      <span className="mt-1 block text-sm font-semibold text-muted">
                        {hero.ticket.prizesDetail}
                      </span>
                    </>
                  ),
                },
              ]}
              footer={
                <div className="flex flex-col gap-3 border-t-2 border-ink/15 pt-4">
                  <p className="u-mono text-muted">{hero.ticket.labels.countdown}</p>
                  <Countdown
                    variant="tiles"
                    deadline={closeAt}
                    suffix={hero.countdownSuffix}
                    closedLabel={hero.countdownClosed}
                    loadingLabel={hero.countdownLoading}
                    labels={hero.countdownLabels}
                  />
                </div>
              }
            />
          </div>
        </div>

        {/* Facts strip */}
        <ul className="grid gap-4 pb-16 sm:grid-cols-2 lg:grid-cols-4">
          {hero.facts.map((fact, index) => (
            <li
              key={fact.label}
              className={`${index === 0 ? "sticker-yellow" : "sticker"} flex flex-col gap-1 p-5`}
            >
              <p className={`u-mono ${index === 0 ? "text-ink" : "text-muted"}`}>
                {fact.label}
              </p>
              <p className="u-display mt-2 text-balance text-xl xl:text-2xl">{fact.value}</p>
              <p className={`text-sm ${index === 0 ? "text-ink-soft" : "text-muted"}`}>
                {fact.detail}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      {/* Why privacy */}
      <Section id={sectionIds.why} tone="deep">
        <SectionHeading number="01" eyebrow={whyPrivacy.eyebrow} title={whyPrivacy.title} />
        <div className="grid min-w-0 gap-10 xl:grid-cols-[1fr_1.15fr] xl:items-start">
          <div className="flex min-w-0 flex-col gap-5 text-base leading-relaxed text-ink-soft sm:text-lg">
            <p className="sticker-kraft p-5 font-display text-lg font-bold leading-snug text-ink sm:text-xl">
              {whyPrivacy.opening.beforeBalance}{" "}
              <Redaction>{whyPrivacy.opening.balance}</Redaction>
              {whyPrivacy.opening.betweenPayments}{" "}
              <Redaction>{whyPrivacy.opening.sender}</Redaction>{" "}
              {whyPrivacy.opening.afterSender}
            </p>
            <p>{whyPrivacy.paragraphs[0]}</p>
            <p>{whyPrivacy.paragraphs[1]}</p>
            <p className="border-l-4 border-emerald pl-4 font-semibold text-ink">
              {whyPrivacy.paragraphs[2]}
            </p>
          </div>
          <div className="min-w-0">
            <ShieldedPoolDiagram />
          </div>
        </div>
      </Section>

      {/* Cloak */}
      <Section id={sectionIds.cloak}>
        <SectionHeading number="02" eyebrow={cloakSection.eyebrow} title={cloakSection.title} />
        <div className="flex flex-col gap-8">
          <div className="sticker overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-ink text-surface-raised">
                    <th className="u-mono px-4 py-3" scope="col">
                      &nbsp;
                    </th>
                    {cloakSection.table.columns.map((column) => (
                      <th key={column} className="u-mono px-4 py-3" scope="col">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cloakSection.table.rows.map((row, rowIndex) => (
                    <tr
                      key={row.name}
                      className={rowIndex % 2 === 1 ? "bg-surface" : "bg-surface-raised"}
                    >
                      <th
                        scope="row"
                        className="border-t-2 border-ink/10 px-4 py-4 font-display text-lg font-black"
                      >
                        {row.name}
                      </th>
                      {row.values.map((value, index) => (
                        <td
                          key={`${row.name}-${index}`}
                          className="border-t-2 border-ink/10 px-4 py-4 text-ink-soft"
                        >
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="card-cut card-cut-ink grid gap-6 p-6 sm:p-8 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-10">
            <a
              href={cloakSponsor.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center bg-surface-raised px-5 py-4"
            >
              <Image
                src={cloakSponsor.logo}
                width={cloakSponsor.width}
                height={cloakSponsor.height}
                alt={cloakSponsor.name}
                className="h-8 w-auto"
              />
            </a>
            <div className="flex flex-col gap-4">
              <p className="max-w-3xl text-base leading-relaxed text-surface-raised/90 sm:text-lg">
                {cloakSection.description}
              </p>
              <p className="flex flex-wrap gap-2">
                {devWithCloak.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="pill border-surface-raised text-surface-raised hover:bg-surface-raised/10"
                  >
                    {link.label}
                    <ArrowOut />
                  </a>
                ))}
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Challenge */}
      <Section id={sectionIds.challenge} tone="dots">
        <SectionHeading
          number="03"
          eyebrow={challenge.eyebrow}
          title={challenge.title}
          lede={challenge.prizeSummary}
          aside={
            <div className="sticker-yellow flex flex-col gap-3 p-5 sm:min-w-64">
              <p className="u-mono">{challenge.prizeLabel}</p>
              <p className="u-display text-4xl sm:text-5xl">{challenge.prizeFigure}</p>
              <p className="text-sm font-semibold">{challenge.prizeBreakdown}</p>
              <ul className="mt-1 grid grid-cols-2 gap-2 border-t-2 border-ink/20 pt-3">
                {challenge.pools.map((pool) => (
                  <li key={pool.name} className="flex flex-col">
                    <span className="u-mono">{pool.name}</span>
                    <span className="font-display text-lg font-black leading-tight">
                      {pool.amount}
                    </span>
                    <span className="text-xs text-ink-soft">{pool.note}</span>
                  </li>
                ))}
              </ul>
            </div>
          }
        />
        <ol className="grid gap-6 md:grid-cols-3">
          {challenge.categories.map((category, index) => (
            <li
              key={category.name}
              className="sticker sticker-hover flex flex-col gap-4 p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="numeral text-5xl">0{index + 1}</span>
                <span className="u-mono whitespace-nowrap text-muted">
                  {challenge.categoryHeader} {index + 1}
                </span>
              </div>
              <h3 className="font-display text-2xl font-black leading-tight">
                {category.name}
              </h3>
              {category.note ? (
                <p className="u-mono text-emerald-deep">{category.note}</p>
              ) : null}
              <p className="text-sm leading-relaxed text-muted">{category.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          <div className="card-cut card-cut-ink p-7 sm:p-9">
            <Eyebrow onInk>{challenge.coreMessageLabel}</Eyebrow>
            <p className="mt-5 font-display text-2xl font-black leading-tight sm:text-3xl">
              {challenge.coreMessage}
            </p>
          </div>
          <div
            className="sticker-kraft p-6 sm:p-7"
          >
            <Eyebrow>{challenge.reminderLabel}</Eyebrow>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft sm:text-base">
              {challenge.reminder}
            </p>
          </div>
        </div>
      </Section>

      {/* How to */}
      <Section id={sectionIds.howTo}>
        <SectionHeading number="04" eyebrow={howTo.eyebrow} title={howTo.title} />
        <ol className="grid gap-8 md:grid-cols-3">
          {howTo.steps.map((step, index) => (
            <li
              key={step.title}
              className="flex flex-col gap-4 border-t-4 border-ink pt-6"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="numeral text-7xl sm:text-8xl">{index + 1}</span>
                <span className="u-mono text-muted">
                  {howTo.stepLabel} {index + 1}
                </span>
              </div>
              <h3 className="u-display text-3xl lg:text-4xl">{step.title}</h3>
              <p className="text-base leading-relaxed text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-12 flex flex-wrap items-center gap-4">
          <CutLink href={primaryHref} variant="primary" size="lg">
            {primaryLabel}
          </CutLink>
          <CutLink href={`/#${sectionIds.requirements}`} variant="outline" size="lg">
            {requirements.title}
          </CutLink>
        </div>
      </Section>

      {/* Requirements */}
      <Section id={sectionIds.requirements} tone="deep">
        <SectionHeading number="05" eyebrow={requirements.eyebrow} title={requirements.title} />
        <ol className="grid gap-5 md:grid-cols-2">
          {requirements.items.map((item, index) => (
            <li
              key={item.title}
              className="sticker flex gap-4 p-5 sm:p-6"
            >
              <span
                aria-hidden
                className="flex h-9 w-9 shrink-0 items-center justify-center border-2 border-ink bg-yellow font-display text-sm font-black"
              >
                {index + 1}
              </span>
              <p className="text-base leading-relaxed text-ink-soft">
                <span className="font-display text-lg font-black text-ink">
                  {item.title}
                </span>{" "}
                {item.body}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Judging */}
      <Section id={sectionIds.judging}>
        <SectionHeading
          number="06"
          eyebrow={judging.eyebrow}
          title={judging.title}
          lede={judging.intro}
        />
        <div className="sticker p-5 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <p className="u-mono text-muted">{judging.labels.weight}</p>
            <p className="u-mono text-muted">{judging.labels.total} 100%</p>
          </div>
          <div
            aria-hidden
            className="mt-3 flex h-5 w-full overflow-hidden border-2 border-ink bg-surface"
          >
            {judging.criteria.map((criterion, index) => (
              <span
                key={criterion.key}
                className={`${WEIGHT_COLORS[index % WEIGHT_COLORS.length]} ${
                  index > 0 ? "border-l-2 border-ink" : ""
                }`}
                style={{ width: criterion.weight }}
              />
            ))}
          </div>
          <ol className="mt-8 grid gap-x-10 gap-y-7 md:grid-cols-2">
            {judging.criteria.map((criterion, index) => (
              <li key={criterion.key} className="flex flex-col gap-3 border-t-2 border-ink/15 pt-5">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-display text-xl font-black leading-tight">
                    <span className="u-mono mr-2 text-emerald-deep">0{index + 1}</span>
                    {criterion.label}
                  </h3>
                  <span className="u-display text-3xl text-emerald-deep">
                    {criterion.weight}
                  </span>
                </div>
                <div className="weight-bar" aria-hidden>
                  <span
                    className={WEIGHT_COLORS[index % WEIGHT_COLORS.length]}
                    style={{ width: criterion.weight }}
                  />
                </div>
                <p className="text-sm leading-relaxed text-muted">
                  <span className="u-mono mr-2 text-ink">{judging.labels.guidance}</span>
                  {criterion.guidance}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* Payout */}
      <Section id={sectionIds.payout} tone="ink">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:items-center">
          <div>
            <SectionHeading
              number="07"
              eyebrow={payout.eyebrow}
              title={payout.title}
              onInk
            />
            <p className="max-w-2xl text-base leading-relaxed text-surface-raised/85 sm:text-lg">
              {payout.body}
            </p>
          </div>
          <div className="sticker-on-ink flex rotate-[1.5deg] flex-col gap-4 p-6 sm:p-7">
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b-2 border-ink/15 pb-3">
              <span className="u-mono text-emerald-deep">{payout.linkLabel}</span>
              <span className="u-mono text-muted">{payout.linkNote}</span>
            </div>
            <p className="u-display text-5xl sm:text-6xl">{payout.linkAmount}</p>
            <p className="font-mono text-sm">
              <span className="text-muted">https://</span>
              <Redaction>cloak-payment-link-de-uso-unico</Redaction>
            </p>
            <div aria-hidden className="barcode h-8 w-48 text-ink opacity-80" />
          </div>
        </div>
      </Section>

      {/* Calendar */}
      <Section id={sectionIds.calendar}>
        <SectionHeading
          number="08"
          eyebrow={calendar.eyebrow}
          title={calendar.title}
          lede={calendar.note}
        />
        <div>
          <CalendarTrack
            rows={calendar.rows}
            now={now}
            labels={{ now: calendar.now, next: calendar.next, done: calendar.done }}
          />
        </div>
      </Section>

      {/* Dev with Cloak */}
      <Section id={sectionIds.dev} tone="deep">
        <SectionHeading number="09" eyebrow={devWithCloak.eyebrow} title={devWithCloak.title} />
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div className="flex flex-col gap-6">
            <p className="text-lg font-semibold leading-relaxed text-ink">
              {devWithCloak.intro}
            </p>
            <ul className="flex flex-col gap-3">
              {devWithCloak.facts.map((fact) => (
                <Bullet key={fact}>{fact}</Bullet>
              ))}
            </ul>
            <p className="flex flex-wrap gap-2">
              {devWithCloak.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="pill"
                >
                  {link.label}
                  <ArrowOut />
                </a>
              ))}
            </p>
          </div>
          <div
            className="sticker-ink overflow-hidden"
          >
            <div className="flex items-center gap-2 border-b-2 border-surface-raised/15 px-4 py-3">
              <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-danger" />
              <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-yellow" />
              <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-emerald" />
              <span className="u-mono ml-2 text-surface-raised/70">
                {devWithCloak.installLabel}
              </span>
            </div>
            <pre className="whitespace-pre-wrap px-5 py-6 font-mono text-sm leading-relaxed text-surface-raised [overflow-wrap:anywhere] sm:text-base">
              <code>
                <span className="text-yellow">$</span> {devWithCloak.install}
              </code>
            </pre>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-surface-raised/15 px-4 py-3">
              <span className="u-mono text-surface-raised/60">mainnet</span>
              <CopyButton
                value={devWithCloak.install}
                label={devWithCloak.copy}
                copiedLabel={devWithCloak.copied}
                variant="yellow"
                size="sm"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Resources */}
      <Section id={sectionIds.resources}>
        <SectionHeading number="10" eyebrow={resourcesSection.eyebrow} title={resourcesSection.title} />
        <div className="grid gap-6 md:grid-cols-2 md:items-start">
          <div className="flex flex-col gap-6">
            {resources.slice(0, -1).map((group) => (
              <ResourceCard key={group.title} group={group} />
            ))}
          </div>
          {resources.slice(-1).map((group) => (
            <ResourceCard key={group.title} group={group} />
          ))}
        </div>
      </Section>

      {/* Ideas */}
      <Section id={sectionIds.ideas} tone="deep">
        <SectionHeading number="11" eyebrow={ideas.eyebrow} title={ideas.title} />
        <div className="grid gap-6 md:grid-cols-2">
          {ideas.groups.map((group, index) => (
            <div
              key={group.title}
              className={`card-cut p-6 sm:p-8 ${index === 1 ? "card-cut-kraft" : ""}`}
            >
              <h3 className="u-display text-2xl sm:text-3xl">{group.title}</h3>
              <ol className="mt-6 flex flex-col gap-4">
                {group.items.map((item, itemIndex) => (
                  <li key={item} className="flex gap-4 text-sm leading-relaxed text-ink-soft sm:text-base">
                    <span className="u-mono mt-1 shrink-0 text-emerald-deep">
                      0{itemIndex + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section id={sectionIds.faq}>
        <SectionHeading number="12" eyebrow={faqSection.eyebrow} title={faqSection.title} />
        <FaqList items={faq} />
      </Section>

      {/* Fine print */}
      <Section tone="kraft" padding="sm">
        <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
          <div className="flex flex-col gap-3">
            <Eyebrow>{finePrint.eyebrow}</Eyebrow>
            <h2 className="u-display text-2xl">{finePrint.title}</h2>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {finePrint.items.map((item) => (
              <Bullet key={item}>{item}</Bullet>
            ))}
          </ul>
        </div>
      </Section>

      {/* Results (P2) */}
      {resultsPublished ? (
        <Section id="resultados" tone="dots">
          <SectionHeading eyebrow={results.eyebrow} title={results.title} lede={results.intro} />
          <CutLink href="/resultados" variant="yellow" size="lg">
            {cta.seeWinners}
          </CutLink>
        </Section>
      ) : null}

      {/* Closing CTA */}
      <Section tone="ink" padding="lg">
        <div className="flex flex-col items-start gap-8">
          <Badge tone="light">{site.challengeName}</Badge>
          <h2 className="u-display max-w-5xl text-4xl sm:text-5xl lg:text-7xl">
            {isOpen ? closing.open : closing.closed}
          </h2>
          <div className="flex flex-wrap gap-3">
            <CutLink href={primaryHref} variant="yellow" size="lg">
              {primaryLabel}
            </CutLink>
            <CutLink href="/projetos" variant="outline-light" size="lg">
              {cta.gallery}
            </CutLink>
          </div>
          <p className="u-mono text-surface-raised/60">{site.domain}</p>
        </div>
      </Section>
    </>
  );
}
