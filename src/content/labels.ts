import type { Category, ProofType, Tech } from "@/lib/validation";

export const categoryLabels: Record<Category, string> = {
  cloak: "Integração com Cloak",
  zcash: "Integração com Zcash",
  private_payments: "Pagamentos privados",
};

export const techLabels: Record<Tech, string> = {
  cloak: "Cloak",
  zcash: "Zcash",
  both: "Os dois",
};

export const techPoolLabels: Record<Tech, string> = {
  cloak: "Cloak",
  zcash: "Zcash",
  both: "Cloak e Zcash",
};

export const proofTypeLabels: Record<ProofType, string> = {
  solana_tx: "Transação na Solana (mainnet)",
  zcash_tx: "Transação Zcash",
  app_url: "App no ar",
};

export const proofTypeHelp: Record<ProofType, string> = {
  solana_tx: "Assinatura da transação na mainnet da Solana (base58).",
  zcash_tx:
    "Txid de 64 caracteres. Vale mainnet, testnet ou regtest com o passo a passo no repositório.",
  app_url: "URL https:// de um app publicado que a gente consiga usar.",
};

export const statusLabels = {
  submitted: "Enviado",
  hidden: "Oculto",
  disqualified: "Desclassificado",
} as const;

export const payoutStatusLabels = {
  pending: "Pendente",
  link_sent: "Link enviado",
  claimed: "Resgatado",
} as const;

export const prizePoolLabels = {
  cloak: "Cloak",
  zcash: "Zcash",
} as const;
