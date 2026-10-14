-- Admin step 1: drafts, scheduling, excerpt and match/gallery links for articles.
-- Safe to run more than once. Existing articles stay published.
alter table articles add column if not exists status text not null default 'published';
do $$ begin
  alter table articles add constraint articles_status_check check (status in ('draft', 'published'));
exception when duplicate_object then null; end $$;
alter table articles add column if not exists excerpt text;
alter table articles add column if not exists fixture_id uuid references fixtures(id) on delete set null;
alter table articles add column if not exists gallery_id uuid references galleries(id) on delete set null;
alter table articles alter column title drop not null;
alter table articles alter column content set default '';
create index if not exists articles_visible_idx on articles (status, published_at desc);
