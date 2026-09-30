import { TODO_MARCELO } from "./site";

export const hero = {
  eyebrow: "SUPERTEAM BRASIL · PRIVACY WEEK",
  headline: "COLOQUE PRIVACIDADE NO SEU PROJETO.",
  highlight: "PRIVACIDADE",
  sub: "Um desafio de quarta a sábado para quem está construindo no Hackathon da Colosseum. 1000 USDC em 10 prêmios para projetos com Cloak e Zcash.",
  ticket: {
    header: "PRIVACY SPRINT",
    serial: "Nº 0001",
    labels: {
      period: "Período",
      prizes: "Prêmios",
      distribution: "Distribuição",
      countdown: "Tempo restante",
    },
    period: "PERÍODO: 30 SET → 03 OUT, 23:59 (BRT)",
    prizes: "PRÊMIOS: 1000 USDC",
    prizesDetail: "10 × 100 USDC · 500 Cloak · 500 Zcash",
  },
  countdownSuffix: "encerra em",
  countdownClosed: "Submissões encerradas",
} as const;

export const whyPrivacy = {
  eyebrow: "POR QUE PRIVACIDADE",
  title: "Sua carteira é um diário público",
  opening: {
    beforeBalance: "Na Solana, qualquer pessoa com o seu endereço vê",
    balance: "o seu saldo",
    betweenPayments: ", cada pagamento que entrou,",
    sender: "de quem veio",
    afterSender:
      "e a que horas. Dá para ver com quem você negocia e quanto recebe por mês. Não é hack: é o padrão da rede.",
  },
  paragraphs: [
    "No Brasil, o seu extrato é protegido por lei, o sigilo bancário. O Pix que você manda não aparece para o seu vizinho. Na Solana, a sua carteira é um diário público, e a maioria de nós escreve nele todo dia.",
    "O trilema clássico da blockchain (descentralização, segurança, escalabilidade) nem inclui privacidade. A rede compra confiança com transparência: todo mundo confere porque todo mundo vê. A pergunta de hoje é: dá para conferir sem ver?",
    "Zero knowledge, numa frase: provar que uma coisa é verdade sem revelar por que ela é verdade. Como um RG que responde só “sim, é maior de 18” em vez de mostrar a sua data de nascimento.",
  ],
  diagram: {
    title: "Um shielded pool, em uma imagem",
    caption:
      "A carteira A deposita (público), a nota fica secreta com você, só o commitment vai para a chain. Uma prova ZK libera o saque para a carteira B (público). A chain vê A entrar e B sair, mas não a linha entre os dois.",
    treeNote: "Merkle tree de commitments + conjunto de nullifiers",
    labels: {
      walletA: "A",
      walletB: "B",
      deposit: "A deposita",
      pool: "Shielded pool",
      withdraw: "B saca",
      note: "nota",
      commitment: "commitment",
      nullifier: "nullifier",
      proof: "prova ZK",
      viewingKey: "viewing key",
      crossed: "a linha entre A e B fica escondida",
    },
  },
} as const;

export const cloakSection = {
  eyebrow: "CLOAK",
  title: "Cloak: Zcash on Solana",
  table: {
    columns: [
      "Saldo público",
      "Saldo shielded",
      "Envio privado",
      "Endereço privado",
      "Viewing key",
      "Swap privado",
    ],
    rows: [
      {
        name: "Zcash",
        values: [
          "endereço transparente",
          "shielded pool",
          "sim",
          "u1…",
          "sim",
          "NEAR Intents",
        ],
      },
      {
        name: "Cloak",
        values: [
          "sua wallet Solana",
          "shielded pool da Cloak",
          "sim",
          "cloak_…",
          "sim",
          "Jupiter",
        ],
      },
    ],
  },
  description:
    "A Cloak é o modelo do Zcash como um programa na Solana: shield, envio privado para qualquer endereço, swap privado pela Jupiter (inclusive para Zcash), payroll e links de pagamento.",
} as const;

export const challenge = {
  eyebrow: "O DESAFIO",
  title: "Prêmios e categorias",
  prizeSummary:
    "1000 USDC em 10 prêmios de 100 USDC: 500 USDC para quem buildar com a Cloak, 500 USDC para quem buildar com Zcash.",
  categories: [
    {
      name: "Integração com Cloak",
      note: "Encaixa na trilha Solana do Hackathon.",
      body: "Pagamentos privados, payouts privados, swaps privados ou payment links com o @cloak.dev/sdk.",
    },
    {
      name: "Integração com Zcash",
      note: "Caminho para a trilha Zcash de US$ 100k.",
      body: "Qualquer coisa que use ZEC ou a rede Zcash: ZEC na Solana, rotas cross-chain ou ferramentas nativas.",
    },
    {
      name: "Pagamentos privados",
      note: "",
      body: "Folha de pagamento, checkout, B2B, qualquer produto em que a privacidade importe, feito com Cloak ou com Zcash.",
    },
  ],
  coreMessage:
    "Não comecem um projeto novo. Coloquem privacidade no projeto que vocês já estão construindo. Os 100 USDC são o bônus; o prêmio de verdade é uma submissão mais forte no Hackathon.",
  coreMessageLabel: "O recado principal",
  categoryLabel: "Categoria",
  categoryHeader: "Categoria",
  reminderLabel: "Lembrete",
  reminder:
    "O Hackathon tem uma trilha Zcash de US$ 100 mil (10 × US$ 10 mil) e uma trilha Solana de US$ 100 mil. Na inscrição do Colosseum dá para marcar até 3 redes: um projeto em Solana que integra Zcash concorre nas duas.",
} as const;

export const howTo = {
  eyebrow: "COMO PARTICIPAR",
  title: "Três passos",
  steps: [
    {
      title: "Construa.",
      body: "Integre Cloak ou Zcash no projeto que você já está construindo para o Hackathon.",
    },
    {
      title: "Grave.",
      body: "Um vídeo de demo de até 2 minutos.",
    },
    {
      title: "Envie.",
      body: "Preencha o formulário até sábado, 03/10, às 23:59 (horário de Brasília). Dá para editar até o prazo.",
    },
  ],
} as const;

export const requirements = {
  eyebrow: "PARA VALER",
  title: "Requisitos",
  items: [
    {
      title: "Código.",
      body: "Repositório no GitHub (público, ou com acesso liberado para os jurados). Se for uma integração num projeto existente, indiquem a branch, o PR ou o intervalo de commits feitos durante o sprint.",
    },
    {
      title: "Prova de que funciona.",
      body: "Uma assinatura de transação na mainnet (Cloak), uma transação Zcash (mainnet, testnet ou regtest com o passo a passo), ou um app publicado que a gente consiga usar.",
    },
    {
      title: "Vídeo de demo de até 2 minutos.",
      body: "",
    },
    {
      title: "Texto de privacidade, até 300 palavras,",
      body: "respondendo: o que fica escondido, de quem, e o que se ganha com isso. É a parte mais importante para a avaliação, e dá para usar direto no pitch do Hackathon.",
    },
  ],
} as const;

export const judging = {
  eyebrow: "JULGAMENTO",
  title: "Como a gente avalia",
  criteria: [
    {
      key: "privacy_impact",
      label: "Impacto de privacidade",
      weight: "30%",
      guidance:
        "Protege algo real; o texto deixa claro o que fica escondido, de quem, e o que se ganha.",
    },
    {
      key: "execution",
      label: "Produto funcionando e execução",
      weight: "30%",
      guidance: "Roda; as transações ou o app provam isso.",
    },
    {
      key: "project_fit",
      label: "Encaixe com o projeto do Hackathon",
      weight: "20%",
      guidance: "Deixa a submissão principal mais forte; o negócio é claro.",
    },
    {
      key: "ux_presentation",
      label: "UX e apresentação",
      weight: "20%",
      guidance:
        "Alguém de fora de cripto entenderia e usaria; o vídeo é claro.",
    },
  ],
} as const;

export const payout = {
  eyebrow: "PAGAMENTO",
  title: "Como o prêmio é pago",
  body: "Cada vencedor recebe um payment link da Cloak de 100 USDC, enviado em privado para o contato informado no formulário. É um link de uso único: quem tiver o link resgata o valor para a própria carteira, sem precisar informar o endereço antes. Trate o link como dinheiro vivo: não compartilhe e resgate assim que receber.",
} as const;

export const calendar = {
  eyebrow: "CALENDÁRIO",
  title: "Datas",
  note: "Todos os horários em BRT (horário de Brasília).",
  rows: [
    {
      when: "Qua 30/09, 15h",
      what: "Workshop “Intro Zero Knowledge: Zcash + Cloak” no the/Garage (Solana House) e abertura do desafio",
    },
    { when: "Qua 30/09 a Sáb 03/10", what: "Build" },
    {
      when: "Qui 01/10 e Sex 02/10",
      what: "Office hours",
      todo: TODO_MARCELO,
      todoNote: "horário e local",
    },
    { when: "Sáb 03/10, 23:59", what: "Encerramento das submissões" },
    { when: TODO_MARCELO, what: "Resultado", todo: true },
    {
      when: "Ter 13/10, 03:59",
      what: "Prazo do Hackathon da Colosseum (12/10, 23:59 PT)",
    },
  ],
} as const;

export const devWithCloak = {
  eyebrow: "DESENVOLVIMENTO",
  title: "Desenvolvendo com Cloak (mainnet)",
  intro:
    "O desenvolvimento com Cloak é feito na mainnet da Solana; não existe devnet nem sandbox.",
  facts: [
    "Instalação: npm install @cloak.dev/sdk @solana/kit",
    "Depósito mínimo 0,01 SOL (ou 1 USDC / 1 USDT). Sair do pool custa 0,005 SOL + 0,3% (pool de SOL) ou 0,45 USDC/USDT + 0,3%. Depositar é grátis.",
    "Tenha pelo menos 0,07 SOL na carteira para o primeiro teste.",
    "Salve sempre o result.outputUtxos antes de considerar a operação concluída.",
  ],
  links: [
    { href: "https://docs.cloak.ag", label: "docs.cloak.ag" },
    { href: "https://docs.cloak.ag/llms.txt", label: "docs.cloak.ag/llms.txt" },
  ],
} as const;

export interface ResourceItem {
  label: string;
  href: string;
  note?: string;
}

export interface ResourceGroup {
  title: string;
  items: ResourceItem[];
}

export const resources: ResourceGroup[] = [
  {
    title: "Cloak",
    items: [
      { label: "Documentação e SDK", href: "https://docs.cloak.ag" },
      {
        label: "Contexto para assistentes de código (Codex, Claude)",
        href: "https://docs.cloak.ag/llms.txt",
      },
    ],
  },
  {
    title: "Solana",
    items: [
      {
        label: "Surfpool, cópia local da mainnet para testar o resto do seu app",
        href: "https://surfpool.run",
        note: "O Cloak em si roda na mainnet.",
      },
      {
        label: "Docs do Surfpool",
        href: "https://solana.com/docs/tools/surfpool",
      },
      {
        label: "Recursos oficiais do Hackathon",
        href: "https://colosseum.com/worldsfair/resources",
      },
      {
        label: "Hub do Superteam Brasil",
        href: "https://hackathon.superteam.com.br",
      },
    ],
  },
  {
    title: "Zcash",
    items: [
      {
        label: "Zarvis, guia de Zcash com IA que responde em português",
        href: "https://openzcash.org/zarvis",
      },
      { label: "Documentação do Zcash", href: "https://zcash.readthedocs.io" },
      {
        label: "Especificações (ZIP-321 pagamentos, ZIP-316 endereços)",
        href: "https://zips.z.cash",
      },
      { label: "Wiki da comunidade", href: "https://zechub.wiki" },
      {
        label: "NEAR Intents, rota entre SOL e ZEC pela 1Click API",
        href: "https://docs.near-intents.org",
      },
      {
        label: "Regtest local do Zcash num comando",
        href: "https://github.com/zcashlabs/thus-spoke-zakura",
      },
      { label: "Faucet de testnet", href: "https://zcashfaucet.jinolabs.xyz" },
      {
        label: "Stack Z3 (Zebra, Zaino, Zallet)",
        href: "https://openzcash.org/z3",
      },
      {
        label: "ZEC na Solana: use só o mint verificado",
        href: "https://solscan.io/token/A7bdiYdS5GjqGFtxf17ppRHtDKPkkRqbKtR27dxvQXaS",
        note: "A7bdiYdS5GjqGFtxf17ppRHtDKPkkRqbKtR27dxvQXaS",
      },
    ],
  },
];

export const resourcesSection = {
  eyebrow: "RECURSOS",
  title: "Links úteis",
} as const;

export const ideas = {
  eyebrow: "IDEIAS PARA COMEÇAR",
  title: "Por onde começar",
  groups: [
    {
      title: "Com Cloak",
      items: [
        "Folha de pagamento privada para startup ou DAO: payouts em USDC em lote, com relatório CSV gerado pela viewing key para o contador.",
        "Payment links dentro de um bot de WhatsApp ou Telegram: “mande 20 USDC para qualquer pessoa, sem saber o endereço dela”.",
        "Checkout privado para lojistas, com exportação contábil via viewing key.",
        "Um “modo privacidade” numa carteira ou dApp existente: sacar para um endereço novo.",
        "Gorjetas ou doações privadas para criadores.",
      ],
    },
    {
      title: "Com Zcash",
      items: [
        "“Saída para o shielded”: trocar SOL ou USDC por ZEC nativo pela NEAR Intents e orientar o shield numa carteira como a Zodl.",
        "SOL privado para ZEC: shield no Cloak e swap privado para ZEC na Solana, entregue num endereço novo.",
        "Checkout em ZEC shielded que libera algo na Solana (por exemplo um passe numa carteira nova).",
        "“Pague com Zodl”: QR codes de cobrança no padrão ZIP-321.",
        "Payouts de contribuidores de uma DAO da Solana em ZEC shielded, com viewing keys para o auditor.",
      ],
    },
  ],
} as const;

export interface FaqItem {
  question: string;
  answer: string;
  todo?: boolean;
}

export const faq: FaqItem[] = [
  {
    question: "Quem pode participar?",
    answer: TODO_MARCELO,
    todo: true,
  },
  {
    question: "Posso participar sozinho?",
    answer: "Sim. Solo ou em time, uma submissão por time.",
  },
  {
    question: "Posso enviar um projeto novo?",
    answer:
      "Pode, mas integrar privacidade no projeto que você já está construindo para o Hackathon conta a favor.",
  },
  {
    question: "Tem devnet para a Cloak?",
    answer: "Não. O desenvolvimento é na mainnet, com valores pequenos.",
  },
  {
    question: "Quanto custa testar na mainnet?",
    answer:
      "Depositar é grátis; sair do pool custa 0,005 SOL + 0,3% no pool de SOL. Tenha uns 0,07 SOL para o primeiro teste.",
  },
  {
    question: "O ZEC na Solana é privado?",
    answer:
      "Não. O token SPL de ZEC na Solana é um token comum; a privacidade vem de usar um shielded pool ou de levar para ZEC nativo e fazer shield.",
  },
  {
    question: "Posso usar Cloak e Zcash no mesmo projeto?",
    answer:
      "Pode. Marque “os dois” no formulário e as duas redes na inscrição do Colosseum.",
  },
  {
    question: "Posso editar depois de enviar?",
    answer:
      "Sim, pelo link de edição que aparece depois do envio, até sábado 23:59.",
  },
  {
    question: "Como recebo o prêmio?",
    answer: "Por um payment link da Cloak de 100 USDC, enviado em privado.",
  },
  {
    question: "Quem julga?",
    answer: TODO_MARCELO,
    todo: true,
  },
  {
    question: "Onde tiro dúvidas?",
    answer: `Marcelo e Victor (Cloak) no the/Garage depois do workshop, office hours na quinta e na sexta, e ${TODO_MARCELO}: link do grupo de suporte.`,
    todo: true,
  },
];

export const faqSection = {
  eyebrow: "DÚVIDAS",
  title: "Perguntas frequentes",
} as const;

export const closing = {
  open: "Envie o seu projeto até sábado.",
  closed: "Veja os projetos enviados.",
} as const;

export const finePrint = {
  eyebrow: "LETRAS MIÚDAS",
  title: "Regras e direitos",
  items: [
    "As submissões precisam seguir as regras do Hackathon da Colosseum; os times mantêm todos os direitos sobre o próprio trabalho.",
    "Nada de usar fundos de terceiros; testes com usuários reais só com consentimento deles.",
    "A organização pode desclassificar plágio ou trabalho claramente feito antes do sprint.",
    "A decisão dos jurados é final.",
  ],
} as const;

export const results = {
  eyebrow: "RESULTADO",
  title: "Vencedores",
  intro: "Os vencedores do Privacy Sprint, por pool de prêmio.",
  pools: [
    { key: "cloak" as const, title: "Cloak" },
    { key: "zcash" as const, title: "Zcash" },
  ],
  empty: "O resultado ainda não foi publicado.",
} as const;
