/**
 * Site-wide copy and metadata (PT-BR).
 *
 * Organizers edit wording here. Keep the public-facing copy in this module.
 */

export const site = {
  brand: "Privacy Week",
  organizer: "Superteam Brasil",
  challengeName: "Privacy Sprint",
  domain: "privacy.superteam.com.br",
  title: "Privacy Week · Superteam Brasil",
  description:
    "Um desafio de quarta a sábado para quem está construindo no Hackathon da Colosseum. 1000 USDC em 10 prêmios para projetos com Cloak e Zcash.",
  tagline: "Coloque privacidade no seu projeto.",
} as const;

export const nav = [
  { href: "/#desafio", label: "Desafio" },
  { href: "/#como-participar", label: "Como participar" },
  { href: "/projetos", label: "Projetos" },
  { href: "/#recursos", label: "Recursos" },
  { href: "/#duvidas", label: "Dúvidas" },
] as const;

export const accessibility = {
  skipToContent: "Pular para o conteúdo",
  primaryNavigation: "Principal",
} as const;

export const headerLabels = {
  menu: "Menu",
} as const;

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
  sponsors: [
    {
      name: "Cloak",
      href: "https://www.cloak.ag",
      logo: "/brands/cloak-logo.png",
      width: 200,
      height: 55,
    },
    {
      name: "Zcash Brasil",
      href: "https://zcashbr.com",
      logo: "/brands/zcash-brasil.png",
      width: 512,
      height: 512,
    },
    {
      name: "Superteam Brasil",
      href: "https://hackathon.superteam.com.br",
      logo: "/brands/superteam-brasil.svg",
      width: 508,
      height: 87,
    },
  ],
  links: [
    { href: "https://docs.cloak.ag", label: "docs.cloak.ag" },
    { href: "https://hackathon.superteam.com.br", label: "Hackathon Superteam Brasil" },
    { href: "https://colosseum.com/worldsfair", label: "Colosseum World's Fair" },
  ],
} as const;
