-- Admin step 2: gallery cover, remembered opponent teams, public training read. Safe to run more than once.
alter table galleries add column if not exists cover_image_url text;

create table if not exists teams (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  logo_url text,
  created_at timestamptz not null default now()
);
alter table teams enable row level security; -- admin uses the service role; no public access needed

-- Fill the team list from existing matches (one row per opponent name; the newest match that has a logo wins)
insert into teams (name, logo_url)
select distinct on (trim(opponent)) trim(opponent),
  case when is_home_game then away_logo_url else home_logo_url end
from fixtures
where opponent is not null and trim(opponent) <> ''
order by trim(opponent), (case when is_home_game then away_logo_url else home_logo_url end) is null, match_date desc
on conflict (name) do nothing;

-- Teams created earlier without a logo pick one up from their matches
update teams t set logo_url = f.logo
from (
  select distinct on (trim(opponent)) trim(opponent) as name,
    case when is_home_game then away_logo_url else home_logo_url end as logo
  from fixtures
  where (case when is_home_game then away_logo_url else home_logo_url end) is not null
  order by trim(opponent), match_date desc
) f
where t.name = f.name and t.logo_url is null;

-- Public pages read active training sessions with the anon key
alter table training_sessions enable row level security;
drop policy if exists "Public can read active training" on training_sessions;
create policy "Public can read active training" on training_sessions
  for select to anon, authenticated using (is_active = true);
