# Production checklist

Run these steps only after Marcelo signs off on the local site. This document is a checklist; no cloud project, deployment, or DNS changes are configured here.

1. **Create Supabase project**
   - Create the cloud project and save its database credentials securely.
   - Link the repository with `supabase link`.
   - Apply migrations with `supabase db push`.
   - Do not run the local seed against production.
   - Confirm RLS is enabled on every table and there are no `anon` or `authenticated` policies.

2. **Create Vercel project**
   - Import the `solanabr/privacy-week` repository into Vercel.
   - Set the production environment variables: `SUPABASE_URL`, a new `SUPABASE_SERVICE_ROLE_KEY`, `SITE_URL=https://privacy.superteam.com.br`, `SUBMISSIONS_OPEN_AT`, `SUBMISSIONS_CLOSE_AT`, strong unique `ADMIN_USERS` credentials, a new random `IP_HASH_SALT`, and `RESULTS_PUBLISHED=false` until the organizers approve results.
   - Do not configure any `NEXT_PUBLIC_` Supabase variables.
   - Do not set `DEV_NOW` in production.

3. **Configure the domain**
   - Add `privacy.superteam.com.br` to the Vercel project.
   - Create the DNS record Vercel specifies at the `superteam.com.br` DNS provider (often a CNAME to `cname.vercel-dns.com`).
   - Wait for Vercel to confirm domain and TLS status.

4. **Optional abuse protection**
   - Add Cloudflare Turnstile to the submission flow if the organizers want another abuse check.
   - Keep the current rate limit and honeypot active.

5. **Production smoke test**
   - Submit a clearly identified test project, verify its public fields, and edit it with the one-time link.
   - Confirm private contact details appear only in `/admin` and the admin CSV.
   - Check that hide/unhide, winner selection, judging, payout status, and CSV export work.
   - Delete the test row from the Supabase Dashboard after verification, using its unique project name.
   - Publish results only after the organizers confirm the winners by setting `RESULTS_PUBLISHED=true`.
