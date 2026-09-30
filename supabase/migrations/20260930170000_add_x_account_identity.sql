alter table public.submissions
  add column x_user_id text,
  add column x_username text,
  add constraint submissions_x_account_fields_together
    check ((x_user_id is null) = (x_username is null));

comment on column public.submissions.x_user_id is
  'X user ID verified during the private OAuth submission gate.';
comment on column public.submissions.x_username is
  'X username verified during the private OAuth submission gate; never sent to public pages.';
