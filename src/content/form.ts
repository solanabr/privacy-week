export const submissionForm = {
  title: "Enviar projeto",
  honeypotLabel: "Não preencha este campo",
  xConnection: {
    title: "Conta do X",
    disconnected:
      "Conecte sua conta do X antes de enviar o projeto. Faça isso primeiro para não perder o que preencher no formulário.",
    privacy:
      "A conta conectada fica registrada em privado para conferência e não aparece na página pública.",
    connected: (username: string) => `Conta conectada: @${username}`,
    connect: "Conectar com X",
    change: "Trocar conta",
    notConfigured:
      "A conexão com X ainda não está configurada. Avise a organização para liberar os envios.",
    denied: "A conexão foi cancelada. Conecte uma conta do X para continuar.",
    invalidState:
      "Não foi possível validar a conexão com X. Tente conectar novamente.",
    failed:
      "Não foi possível confirmar sua conta do X. Tente conectar novamente.",
  },
  intro:
    "Preencha os dados do seu projeto. Você pode editar tudo pelo link que aparece depois do envio, até segunda, 05/10, às 4h.",
  sections: {
    project: "Sobre o projeto",
    proof: "Prova de que funciona",
    team: "Integrantes",
    contact: "Contato para o prêmio",
    consent: "Confirmação",
  },
  fields: {
    project_name: {
      label: "Nome do projeto",
      help: "",
    },
    team_name: { label: "Nome do time", help: "Opcional." },
    tagline: { label: "Em uma frase, o que o projeto faz", help: "" },
    category: { label: "Categoria", help: "" },
    tech: {
      label: "Construído com",
      help: "Define em qual pool de prêmios o projeto concorre: 500 USDC para Cloak, 500 USDC para Zcash.",
    },
    repo_url: {
      label: "Repositório no GitHub",
      help: "",
      placeholder: "https://github.com/…",
    },
    sprint_changes: {
      label: "O que foi feito no sprint",
      help: "Branch, PR ou intervalo de commits feitos entre quarta e segunda.",
    },
    proof_type: { label: "Tipo de prova", help: "" },
    proof_value: { label: "Prova de que funciona", help: "" },
    demo_video_url: {
      label: "Vídeo de demo (até 2 min)",
      help: "YouTube, Loom ou Vimeo.",
    },
    writeup: {
      label: "Texto de privacidade (até 300 palavras)",
      help: "",
      prompt:
        "O que fica escondido (valor, remetente, destinatário, o vínculo entre eles, saldo)? Escondido de quem (quem observa a chain, a contraparte, o seu backend)? O que se ganha com isso?",
    },
    colosseum_url: { label: "Página do projeto no Colosseum", help: "Opcional." },
    website_url: { label: "Site do projeto", help: "Opcional." },
    members: { label: "Integrantes", help: "De 1 a 6 pessoas." },
    memberRow: "Integrante",
    member_name: "Nome",
    member_x: "X (Twitter)",
    member_github: "GitHub",
    add_member: "Adicionar integrante",
    remove_member: "Remover",
    show_members: "Mostrar os integrantes na página pública",
    contact_name: { label: "Nome de contato", help: "" },
    contact_email: {
      label: "E-mail de contato",
      help: "Privado. Usado só para enviar o prêmio por payment link.",
    },
    contact_telegram: { label: "Telegram", help: "Opcional, privado." },
    contact_whatsapp: { label: "WhatsApp", help: "Opcional, privado." },
    accepted_rules:
      "Li e aceito as regras do Privacy Sprint e do Hackathon da Colosseum",
  },
  submit: "Enviar projeto",
  submitting: "Enviando…",
  requiredHint: "Campos marcados com * são obrigatórios.",
  errors: {
    xRequired: "Conecte sua conta do X antes de enviar o projeto.",
    rateLimited:
      "Muitos envios deste endereço em pouco tempo. Tente de novo mais tarde.",
    closed: "As submissões estão encerradas.",
    notOpenYet: "As submissões ainda não estão abertas.",
    generic: "Não foi possível enviar agora. Tente de novo.",
    invalidToken:
      "Link de edição inválido. Confira o link que você recebeu depois do envio.",
  },
} as const;

export const successPage = {
  title: "Projeto enviado",
  subtitle: "Guarde o link abaixo. Ele é a única forma de editar o seu projeto.",
  ticketLabel: "Comprovante",
  editLinkLabel: "Link de edição",
  editLinkWarning:
    "Este link aparece uma única vez. Copie e guarde agora: sem ele, não dá para editar o projeto depois.",
  copy: "Copiar link",
  copied: "Copiado!",
  viewProjects: "Ver os projetos enviados",
  backHome: "Voltar para o início",
} as const;

export const editPage = {
  title: "Editar projeto",
  subtitle:
    "Você pode editar o projeto até segunda, 05/10, às 4h (horário de Brasília).",
  submit: "Salvar alterações",
  closedMessage: "As submissões estão encerradas. O formulário abaixo está desativado.",
  saved: "Alterações salvas.",
  notFoundTitle: "Link não encontrado",
  notFoundBody: "Este link de edição não existe ou não é mais válido.",
} as const;

export const closedPage = {
  beforeTitle: "As submissões ainda não abriram",
  closedTitle: "As submissões estão encerradas",
  beforeBody:
    "O Privacy Sprint abre quarta, 30/09, às 15h. Volte aqui depois do workshop.",
  closedBody:
    "O prazo terminou em segunda, 05/10, às 4h. Veja os projetos enviados na galeria.",
} as const;
