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
    "Um desafio de quarta a domingo para quem está construindo no Hackathon da Colosseum. 1000 USDC em 10 prêmios para projetos com Cloak e Zcash.",
  tagline: "Coloque privacidade no seu projeto.",
  year: "2026",
} as const;

export const nav = [
  { href: "/#desafio", label: "Desafio" },
  { href: "/#como-participar", label: "Como participar" },
  { href: "/#calendario", label: "Datas" },
  { href: "/#recursos", label: "Recursos" },
  { href: "/#duvidas", label: "Dúvidas" },
  { href: "/projetos", label: "Projetos" },
] as const;

export const accessibility = {
  skipToContent: "Pular para o conteúdo",
  primaryNavigation: "Principal",
  sectionNavigation: "Seções da página",
  scrollProgress: "Progresso da leitura",
} as const;

export const headerLabels = {
  menu: "Menu",
  close: "Fechar",
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
  gallery: "Galeria",
  seeWinners: "Ver os vencedores",
  backHome: "Voltar para o início",
} as const;

export const footer = {
  tagline:
    "Um desafio de privacidade da Superteam Brasil para quem está construindo no Hackathon da Colosseum, com Cloak e Zcash.",
  sponsorsLabel: "Patrocinadores",
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
  columns: [
    {
      title: "Privacy Week",
      links: [
        { href: "/#desafio", label: "O desafio" },
        { href: "/#como-participar", label: "Como participar" },
        { href: "/#julgamento", label: "Julgamento" },
        { href: "/projetos", label: "Projetos enviados" },
      ],
    },
    {
      title: "Links",
      links: [
        { href: "https://docs.cloak.ag", label: "docs.cloak.ag" },
        {
          href: "https://hackathon.superteam.com.br",
          label: "Hackathon Superteam Brasil",
        },
        { href: "https://colosseum.com/worldsfair", label: "Colosseum World's Fair" },
      ],
    },
  ],
  links: [
    { href: "https://docs.cloak.ag", label: "docs.cloak.ag" },
    { href: "https://hackathon.superteam.com.br", label: "Hackathon Superteam Brasil" },
    { href: "https://colosseum.com/worldsfair", label: "Colosseum World's Fair" },
  ],
  copyright: "© 2026 Superteam Brasil",
} as const;
