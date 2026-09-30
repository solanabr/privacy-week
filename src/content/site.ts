/**
 * Site-wide copy and metadata (PT-BR).
 *
 * Organizers edit wording here. `TODO_MARCELO` marks content that still needs a
 * decision from Marcelo; it is rendered as a visible placeholder.
 */

export const TODO_MARCELO = "TODO(Marcelo)";

export const site = {
  brand: "Privacy Week",
  organizer: "Superteam Brasil",
  challengeName: "Privacy Sprint",
  domain: "privacy.superteam.com.br",
  title: "Privacy Week · Superteam Brasil",
  description:
    "Um desafio de quarta a sábado para quem está construindo no Hackathon da Colosseum. 1000 USDC em 10 prêmios para projetos com Cloak e Zcash.",
  tagline: "Coloque privacidade no seu projeto.",
  /** TODO(Marcelo): official logo files; until then a text wordmark. */
  logo: TODO_MARCELO,
} as const;

export const nav = [
  { href: "/#desafio", label: "Desafio" },
  { href: "/#como-participar", label: "Como participar" },
  { href: "/projetos", label: "Projetos" },
  { href: "/#recursos", label: "Recursos" },
  { href: "/#duvidas", label: "Dúvidas" },
] as const;

export const sectionIds = {
  why: "por-que",
  cloak: "cloak",
  challenge: "desafio",
  howTo: "como-participar",
  requirements: "requisitos",
  judging: "julgamento",
  payout: "premio",
  calendar: "calendario",
  dev: "desenvolvimento",
  resources: "recursos",
  ideas: "ideias",
  faq: "duvidas",
} as const;

export const cta = {
  submit: "Enviar projeto",
  viewProjects: "Ver projetos",
  rules: "Ver as regras",
} as const;

export const footer = {
  /** TODO(Marcelo): confirm how organizers and any sponsors should be credited. */
  credit: TODO_MARCELO,
  creditNote:
    "Não liste o Zcash nem qualquer outra pessoa como patrocinador até confirmação.",
  links: [
    { href: "https://docs.cloak.ag", label: "docs.cloak.ag" },
    { href: "https://hackathon.superteam.com.br", label: "Hackathon Superteam Brasil" },
    { href: "https://colosseum.com/worldsfair", label: "Colosseum World's Fair" },
  ],
} as const;
