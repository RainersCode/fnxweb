-- Admin step 2: gallery cover, remembered opponent teams, public training read. Safe to run more than once.
alter table galleries add column if not exists cover_image_url text;

create table if not exists teams (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  logo_url text,
  created_at timestamptz not null default now()
);
alter table teams enable row level security; -- admin uses the service role; no public access needed

-- Fill the team list from existing matches (one row per opponent name, newest logo wins)
insert into teams (name, logo_url)
select distinct on (trim(opponent)) trim(opponent),
  case when is_home_game then away_logo_url else home_logo_url end
from fixtures
where opponent is not null and trim(opponent) <> ''
order by trim(opponent), match_date desc
on conflict (name) do nothing;

-- Public pages read active training sessions with the anon key
alter table training_sessions enable row level security;
drop policy if exists "Public can read active training" on training_sessions;
create policy "Public can read active training" on training_sessions
  for select to anon, authenticated using (is_active = true);
