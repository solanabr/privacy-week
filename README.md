# Privacy Week

Privacy Week is the Superteam Brasil site for Privacy Sprint, a short privacy challenge for teams building in the Colosseum hackathon. The site explains the challenge, accepts and edits submissions, publishes a project gallery, and gives organizers an authenticated area for review, judging, winner selection, and payout tracking.

The application uses Next.js App Router, TypeScript, Tailwind CSS v4, and a local Supabase Postgres database. Database access stays on the server through one service-role client. Public queries select an explicit list of fields; contact data and moderation data stay in the admin area.

## Prerequisites

- Node.js 20 or later
- pnpm 11
- Docker Desktop or Docker Engine running
- Supabase CLI
- A Playwright Chromium installation for end-to-end tests (`pnpm exec playwright install chromium`)

## Local setup

1. Install dependencies:

   ```sh
   pnpm install
   ```

2. Start the local Supabase stack:

   ```sh
   pnpm db:start
   supabase status
   ```

   Copy the local API URL and service-role key from `supabase status` into `.env.local`. The service-role key is server-only and must not be committed or prefixed with `NEXT_PUBLIC_`.

3. Copy `.env.example` to `.env.local` if you have not already, then set the values for the local database, a private `ADMIN_USERS` password, and a long random `IP_HASH_SALT`. Set `SITE_URL=http://localhost:3000` for normal development. `ADMIN_USERS` accepts comma-separated `name:password` pairs; the name is recorded as the judge on scores. Set `JUDGES` to the subset of names that actually judge when organizers also need admin access; the dashboard at `/admin/dashboard` uses it for judging progress. For manual X login, set `X_CLIENT_ID` and `X_CLIENT_SECRET` from a Web App OAuth 2.0 app and register `${SITE_URL}/auth/x/callback` as a callback URL. E2E tests use a local mock X provider and do not need real X credentials.

4. Apply the migration and local example data when starting with a fresh local database:

   ```sh
   pnpm db:reset
   ```

   This resets the local database and inserts three clearly fake `Exemplo` submissions. The seed is configured for local `db reset`; the production checklist uses `supabase db push` and does not apply it.

5. Run the site:

   ```sh
   pnpm dev
   ```

   Visit <http://localhost:3000>. Set `DEV_NOW` in `.env.local` to an ISO timestamp inside the submission window when testing the submission form. It only affects development mode.

## Useful commands

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
pnpm db:reset
pnpm db:types
```

`pnpm test:e2e` expects the local Supabase stack and `.env.local` to be configured. It runs the X PKCE connect-and-submit flow against a local mock provider, then checks the open-window submission/edit/gallery/admin/CSV flow and a separate closed-window check. The open-window flow creates a fake submission and leaves it hidden in the local database after checking moderation and CSV export. Use `pnpm db:reset` when you want to clear local test data and restore the three examples.

## Editing copy

All organizer-facing site copy lives in typed files under `src/content/`. Use organizer-confirmed facts and keep public copy in Brazilian Portuguese; developer documentation, code, comments, and commit messages are in English.

## Security notes

- Supabase reads and writes use `src/lib/db/server.ts` on the server only.
- RLS is enabled on `submissions` and `judge_scores`, with no policies for `anon` or `authenticated`.
- Public queries in `src/lib/db/submissions.ts` use an explicit field whitelist and return only rows with `status = 'submitted'`.
- New submissions require an X OAuth 2.0 Authorization Code + PKCE connection; the server action verifies a signed, HTTP-only session cookie rather than trusting submitted form fields.
- Only the verified X user ID and username are retained on the private submission row for admin review; access tokens are discarded, and public queries never select the X identity columns.
- Edit links contain a random 32-byte token; only its SHA-256 hash is stored. The raw token travels through a short-lived HTTP-only cookie to the one-time success page.
- The database never stores a Cloak payment link. Admins track only the payout status.
- `/admin/**` uses HTTP Basic Auth from `ADMIN_USERS`; every admin Server Action checks the credentials again.

See [DEPLOY.md](./DEPLOY.md) for the production checklist. No cloud project or deployment is configured by this repository.
