import Link from "next/link";

import { Countdown } from "@/components/countdown";
import { CutLink } from "@/components/cut-button";
import { Eyebrow } from "@/components/eyebrow";
import { Highlighter } from "@/components/highlighter";
import { Redaction } from "@/components/redaction";
import { Section } from "@/components/section";
import { ShieldedPoolDiagram } from "@/components/shielded-pool-diagram";
import { TicketCard } from "@/components/ticket";
import { TodoBadge } from "@/components/todo-badge";
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
} from "@/content/home";
import { cta, sectionIds, site, TODO_MARCELO } from "@/content/site";
import { getSubmissionWindow, getWindowState } from "@/lib/window";

export const revalidate = 60;

function Heading({
  eyebrow,
  title,
  id,
}: {
  eyebrow: string;
  title: string;
  id?: string;
}) {
  return (
    <div className="mb-8 flex flex-col gap-3">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 id={id} className="max-w-3xl text-3xl uppercase sm:text-4xl">
        {title}
      </h2>
    </div>
  );
}

function ExternalLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="text-green underline decoration-emerald/50 underline-offset-4 hover:decoration-emerald"
    >
      {children}
    </a>
  );
}

export default function HomePage() {
  const windowState = getWindowState();
  const isOpen = windowState === "open";
  const closeAt = getSubmissionWindow().closeAt.toISOString();
  const resultsPublished = process.env.RESULTS_PUBLISHED === "true";

  const [headlineBefore, headlineAfter] = hero.headline.split(hero.highlight);

  return (
    <>
      {/* Hero */}
      <Section className="pt-12 sm:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="flex flex-col gap-6">
            <Eyebrow>{hero.eyebrow}</Eyebrow>
            <h1 className="text-4xl uppercase sm:text-6xl">
              {headlineBefore}
              <Highlighter>{hero.highlight}</Highlighter>
              {headlineAfter}
            </h1>
            <p className="max-w-xl text-lg text-muted">{hero.sub}</p>
            <div className="flex flex-wrap gap-3">
              <CutLink href={isOpen ? "/enviar" : "/projetos"} variant="primary">
                {isOpen ? cta.submit : cta.viewProjects}
              </CutLink>
              <CutLink href={`/#${sectionIds.challenge}`} variant="secondary">
                {cta.rules}
              </CutLink>
            </div>
          </div>

          <TicketCard
            rotate
            header={hero.ticket.header}
            serial={hero.ticket.serial}
            fields={[
              { label: hero.ticket.labels.period, value: hero.ticket.period },
              { label: hero.ticket.labels.prizes, value: hero.ticket.prizes },
              { label: hero.ticket.labels.distribution, value: hero.ticket.prizesDetail },
              {
                label: hero.ticket.labels.countdown,
                value: (
                  <Countdown
                    deadline={closeAt}
                    suffix={hero.countdownSuffix}
                    closedLabel={hero.countdownClosed}
                  />
                ),
              },
            ]}
          />
        </div>
      </Section>

      {/* Why privacy */}
      <Section id={sectionIds.why} tone="deep">
        <Heading eyebrow={whyPrivacy.eyebrow} title={whyPrivacy.title} />
        <div className="grid min-w-0 gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div className="flex min-w-0 flex-col gap-4 text-base text-ink/90">
            <p>
              {whyPrivacy.opening.beforeBalance}{" "}
              <Redaction>{whyPrivacy.opening.balance}</Redaction>
              {whyPrivacy.opening.betweenPayments}{" "}
              <Redaction>{whyPrivacy.opening.sender}</Redaction>{" "}
              {whyPrivacy.opening.afterSender}
            </p>
            <p>{whyPrivacy.paragraphs[0]}</p>
            <p>{whyPrivacy.paragraphs[1]}</p>
            <p><strong>{whyPrivacy.paragraphs[2]}</strong></p>
          </div>
          <div className="min-w-0">
            <ShieldedPoolDiagram />
          </div>
        </div>
      </Section>

      {/* Cloak */}
      <Section id={sectionIds.cloak}>
        <Heading eyebrow={cloakSection.eyebrow} title={cloakSection.title} />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b-2 border-ink">
                <th className="u-mono py-3 pr-4 text-muted" scope="col">
                  &nbsp;
                </th>
                {cloakSection.table.columns.map((column) => (
                  <th key={column} className="u-mono py-3 pr-4 text-muted" scope="col">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cloakSection.table.rows.map((row) => (
                <tr key={row.name} className="border-b border-ink/15">
                  <th scope="row" className="py-3 pr-4 font-display text-base font-extrabold">
                    {row.name}
                  </th>
                  {row.values.map((value, index) => (
                    <td key={`${row.name}-${index}`} className="py-3 pr-4 text-ink/90">
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-6 max-w-3xl text-base text-ink/90">
          {cloakSection.description}
        </p>
      </Section>

      {/* Challenge */}
      <Section id={sectionIds.challenge} tone="dots">
        <Heading eyebrow={challenge.eyebrow} title={challenge.title} />
        <p className="mb-8 max-w-3xl text-lg font-semibold">{challenge.prizeSummary}</p>
        <ol className="grid gap-5 md:grid-cols-3">
          {challenge.categories.map((category, index) => (
            <li key={category.name}>
              <TicketCard
                header={`${challenge.categoryHeader} ${index + 1}`}
                fields={[{ label: challenge.categoryLabel, value: category.name }]}
                footer={
                  <div className="flex flex-col gap-2">
                    {category.note ? (
                      <span className="u-mono text-emerald">{category.note}</span>
                    ) : null}
                    <p className="text-sm text-muted">{category.body}</p>
                  </div>
                }
              />
            </li>
          ))}
        </ol>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="cut-corner bg-ink p-6 text-surface-raised">
            <p className="u-mono text-surface-raised/70">{challenge.coreMessageLabel}</p>
            <p className="mt-3 font-display text-xl font-extrabold leading-tight">
              {challenge.coreMessage}
            </p>
          </div>
          <div className="cut-corner border border-ink/20 bg-surface-raised p-6">
            <p className="u-mono text-muted">{challenge.reminderLabel}</p>
            <p className="mt-3 text-sm text-ink/90">{challenge.reminder}</p>
          </div>
        </div>
      </Section>

      {/* How to */}
      <Section id={sectionIds.howTo}>
        <Heading eyebrow={howTo.eyebrow} title={howTo.title} />
        <ol className="grid gap-5 md:grid-cols-3">
          {howTo.steps.map((step, index) => (
            <li key={step.title}>
              <TicketCard
                header={`Passo ${index + 1}`}
                serial={`Nº 000${index + 1}`}
                footer={
                  <p className="text-sm text-muted">
                    <span className="font-display text-lg font-extrabold text-ink">
                      {step.title}
                    </span>{" "}
                    {step.body}
                  </p>
                }
              />
            </li>
          ))}
        </ol>
      </Section>

      {/* Requirements */}
      <Section id={sectionIds.requirements} tone="deep">
        <Heading eyebrow={requirements.eyebrow} title={requirements.title} />
        <ol className="grid gap-5 md:grid-cols-2">
          {requirements.items.map((item, index) => (
            <li
              key={item.title}
              className="cut-corner-one border border-ink/15 bg-surface-raised p-5"
            >
              <span className="u-mono text-muted">{`0${index + 1}`}</span>
              <p className="mt-2 text-base text-ink/90">
                <span className="font-display font-extrabold">{item.title}</span>{" "}
                {item.body}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Judging */}
      <Section id={sectionIds.judging}>
        <Heading eyebrow={judging.eyebrow} title={judging.title} />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b-2 border-ink">
                <th className="u-mono py-3 pr-4 text-muted" scope="col">
                  Critério
                </th>
                <th className="u-mono py-3 pr-4 text-muted" scope="col">
                  Peso
                </th>
                <th className="u-mono py-3 pr-4 text-muted" scope="col">
                  O que a gente procura
                </th>
              </tr>
            </thead>
            <tbody>
              {judging.criteria.map((criterion) => (
                <tr key={criterion.key} className="border-b border-ink/15 align-top">
                  <th scope="row" className="py-3 pr-4 font-display font-extrabold">
                    {criterion.label}
                  </th>
                  <td className="py-3 pr-4 u-mono">{criterion.weight}</td>
                  <td className="py-3 pr-4 text-ink/90">{criterion.guidance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Payout */}
      <Section id={sectionIds.payout} tone="kraft">
        <Heading eyebrow={payout.eyebrow} title={payout.title} />
        <p className="max-w-3xl text-lg text-ink/90">{payout.body}</p>
      </Section>

      {/* Calendar */}
      <Section id={sectionIds.calendar}>
        <Heading eyebrow={calendar.eyebrow} title={calendar.title} />
        <p className="mb-6 text-sm text-muted">{calendar.note}</p>
        <ol className="flex flex-col gap-3">
          {calendar.rows.map((row, index) => (
            <li
              key={`${row.when}-${index}`}
              className="cut-corner-sm flex flex-col gap-2 border border-ink/15 bg-surface-raised p-4 sm:flex-row sm:items-center sm:gap-6"
            >
              <span className="u-mono w-48 shrink-0 text-ink">
                {row.when}
              </span>
              <span className="text-sm text-ink/90">{row.what}</span>
              {"todo" in row && row.todo ? (
                <TodoBadge
                  label={TODO_MARCELO}
                  note={"todoNote" in row ? row.todoNote : undefined}
                />
              ) : null}
            </li>
          ))}
        </ol>
      </Section>

      {/* Dev with Cloak */}
      <Section id={sectionIds.dev} tone="deep">
        <Heading eyebrow={devWithCloak.eyebrow} title={devWithCloak.title} />
        <p className="mb-6 max-w-3xl text-base text-ink/90">{devWithCloak.intro}</p>
        <ul className="flex max-w-3xl flex-col gap-3">
          {devWithCloak.facts.map((fact) => (
            <li key={fact} className="flex gap-3 text-sm text-ink/90">
              <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 bg-emerald" />
              <span>{fact}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 flex flex-wrap gap-4 text-sm">
          {devWithCloak.links.map((link) => (
            <ExternalLink key={link.href} href={link.href}>
              {link.label}
            </ExternalLink>
          ))}
        </p>
      </Section>

      {/* Resources */}
      <Section id={sectionIds.resources}>
        <Heading eyebrow={resourcesSection.eyebrow} title={resourcesSection.title} />
        <div className="grid gap-8 md:grid-cols-3">
          {resources.map((group) => (
            <div key={group.title} className="flex flex-col gap-3">
              <h3 className="u-mono text-emerald">{group.title}</h3>
              <ul className="flex flex-col gap-3">
                {group.items.map((item) => (
                  <li key={item.href} className="text-sm">
                    <ExternalLink href={item.href}>{item.label}</ExternalLink>
                    {item.note ? (
                      <p className="mt-1 text-xs text-muted">{item.note}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* Ideas */}
      <Section id={sectionIds.ideas} tone="deep">
        <Heading eyebrow={ideas.eyebrow} title={ideas.title} />
        <div className="grid gap-8 md:grid-cols-2">
          {ideas.groups.map((group) => (
            <div key={group.title} className="flex flex-col gap-3">
              <h3 className="u-mono text-emerald">{group.title}</h3>
              <ul className="flex flex-col gap-3">
                {group.items.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-ink/90">
                    <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 bg-emerald" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section id={sectionIds.faq}>
        <Heading eyebrow={faqSection.eyebrow} title={faqSection.title} />
        <div className="flex max-w-3xl flex-col gap-3">
          {faq.map((item) => (
            <details
              key={item.question}
              className="cut-corner-sm border border-ink/15 bg-surface-raised p-4"
            >
              <summary className="cursor-pointer font-display font-extrabold">
                {item.question}
              </summary>
              <div className="mt-3 flex flex-col gap-2 text-sm text-ink/90">
                {item.todo ? (
                  <TodoBadge label={TODO_MARCELO} />
                ) : null}
                <p>{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </Section>

      {/* Fine print */}
      <Section tone="deep">
        <Heading eyebrow={finePrint.eyebrow} title={finePrint.title} />
        <ul className="flex max-w-3xl flex-col gap-3">
          {finePrint.items.map((item) => (
            <li key={item} className="flex gap-3 text-sm text-ink/90">
              <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 bg-emerald" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Results (P2) */}
      {resultsPublished ? (
        <Section id="resultados" tone="dots">
          <Heading eyebrow={results.eyebrow} title={results.title} />
          <p className="mb-6 max-w-3xl text-base text-ink/90">{results.intro}</p>
          <CutLink href="/resultados" variant="primary">
            Ver os vencedores
          </CutLink>
        </Section>
      ) : null}

      {/* Closing CTA */}
      <Section tone="kraft">
        <div className="flex flex-col items-start gap-5">
          <h2 className="max-w-2xl text-3xl uppercase">
            {isOpen ? closing.open : closing.closed}
          </h2>
          <div className="flex flex-wrap gap-3">
            <CutLink href={isOpen ? "/enviar" : "/projetos"} variant="primary">
              {isOpen ? cta.submit : cta.viewProjects}
            </CutLink>
            <Link
              href="/projetos"
              className="cut-corner-sm inline-flex items-center bg-surface-raised px-5 py-3 font-display text-sm font-extrabold uppercase tracking-[0.08em] text-ink"
            >
              Galeria
            </Link>
          </div>
          <p className="u-mono text-muted">{site.domain}</p>
        </div>
      </Section>
    </>
  );
}
