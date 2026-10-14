-- Admin step 1 follow-up: the public (anon) Supabase key must not read drafts or
-- scheduled articles. The admin uses the service-role key, which bypasses these policies.
-- Safe to run more than once.

-- Show the current read policies on articles (for reference; this query changes nothing)
select policyname, roles, cmd, qual from pg_policies where tablename = 'articles';

alter table articles enable row level security;

drop policy if exists "Public can read articles" on articles;
drop policy if exists "Public can read published articles" on articles;

create policy "Public can read published articles" on articles
  for select to anon, authenticated
  using (status = 'published' and published_at <= now());
