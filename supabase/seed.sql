-- Local development seed data.
--
-- This file is applied by `supabase db reset` (local only). It is NOT applied by
-- `supabase db push`, so it never runs in production. Every row here is obviously
-- fake: project names start with "Exemplo", contacts use example.com addresses and
-- the proof values are not real transactions.

-- Only seed an empty database, so re-running is harmless.
do $$
begin
  if exists (select 1 from submissions) then
    raise notice 'submissions already seeded, skipping';
    return;
  end if;

  insert into submissions (
    slug, project_name, team_name, tagline, category, tech,
    repo_url, sprint_changes, proof_type, proof_value, demo_video_url, writeup,
    colosseum_url, website_url, members, show_members,
    contact_name, contact_email, contact_telegram, contact_whatsapp, accepted_rules,
    status, edit_token_hash, ip_hash
  ) values
  (
    'exemplo-payroll-privado',
    'Exemplo Payroll Privado',
    'Time Exemplo Um',
    'Folha de pagamento privada para DAOs, com recibo por viewing key.',
    'cloak', 'cloak',
    'https://github.com/exemplo/payroll-privado',
    'PR #42: transactBatch com USDC e relatório CSV via viewing key.',
    'solana_tx',
    '5J8kQ2mZ7pXw3nR9tYvB4cD6eF1gH2jK3lM4nP5qR6sT7uV8wX9yZ1aB2cD3eF4gH5jK6lM7nP8qR9sT',
    'https://www.youtube.com/watch?v=exemplo-payroll',
    E'O que fica escondido: valor de cada pagamento e o vínculo entre o salário e o contribuidor.\nEscondido de quem: de qualquer observador da chain e da contraparte que não recebeu o pagamento.\nO que se ganha: a folha deixa de ser um extrato público do time inteiro, e o contador continua com acesso via viewing key.',
    'https://colosseum.com/worldsfair/projects/exemplo-payroll',
    null,
    '[{"name":"Ana Exemplo","x":"@anaexemplo","github":"anaexemplo"},{"name":"Bruno Exemplo","github":"brunoexemplo"}]'::jsonb,
    true,
    'Ana Exemplo', 'ana@example.com', '@anaexemplo', null, true,
    'submitted', encode(digest('seed-token-payroll', 'sha256'), 'hex'), encode(digest('203.0.113.10', 'sha256'), 'hex')
  ),
  (
    'exemplo-checkout-shielded',
    'Exemplo Checkout Shielded',
    'Time Exemplo Dois',
    'Checkout que aceita ZEC shielded e libera um passe na Solana.',
    'zcash', 'zcash',
    'https://github.com/exemplo/checkout-shielded',
    'Commits de 30/09 a 02/10 na branch sprint/zcash-checkout.',
    'zcash_tx',
    '9f2c1d4b6a8e0f3c5d7b9a1e2f4c6d8b0a2e4f6c8d0b2a4e6f8c0d2b4a6e8f0c',
    'https://www.loom.com/share/exemplo-checkout',
    E'O que fica escondido: quem pagou, o valor exato e o memo do pedido.\nEscondido de quem: do observador da chain Zcash e de outros lojistas.\nO que se ganha: um checkout que não publica a receita da loja nem o histórico de compra do cliente.',
    null,
    'https://exemplo.dev',
    '[{"name":"Carla Exemplo","x":"@carlaexemplo"}]'::jsonb,
    true,
    'Carla Exemplo', 'carla@example.com', null, '+5511999990000', true,
    'submitted', encode(digest('seed-token-checkout', 'sha256'), 'hex'), encode(digest('203.0.113.11', 'sha256'), 'hex')
  ),
  (
    'exemplo-split-privado',
    'Exemplo Split Privado',
    'Time Exemplo Três',
    'Rateio de receita entre contribuidores sem expor os valores de cada um.',
    'private_payments', 'both',
    'https://github.com/exemplo/split-privado',
    'PR #7: split privado com Cloak e saída opcional para ZEC nativo.',
    'app_url',
    'https://split.exemplo.dev',
    'https://vimeo.com/exemplo-split',
    E'O que fica escondido: quanto cada contribuidor recebe e a divisão interna da receita.\nEscondido de quem: dos outros contribuidores e de quem observa a chain.\nO que se ganha: o time divide receita sem transformar a remuneração de cada um em informação pública.',
    'https://colosseum.com/worldsfair/projects/exemplo-split',
    'https://split.exemplo.dev',
    '[{"name":"Diego Exemplo","github":"diegoexemplo"},{"name":"Elena Exemplo","x":"@elenaexemplo"},{"name":"Fábio Exemplo"}]'::jsonb,
    true,
    'Diego Exemplo', 'diego@example.com', '@diegoexemplo', null, true,
    'submitted', encode(digest('seed-token-split', 'sha256'), 'hex'), encode(digest('203.0.113.12', 'sha256'), 'hex')
  );
end $$;
