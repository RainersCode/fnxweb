-- News categories: one per article, used by the filter on /news. Safe to run more than once.
alter table articles add column if not exists category text;
do $$ begin
  alter table articles add constraint articles_category_check
    check (category is null or category in ('speles', 'pasakumi', 'veseliba', 'klubs'));
exception when duplicate_object then null; end $$;
create index if not exists articles_category_idx on articles (category, published_at desc);

-- Sort the existing articles (only ones not categorised yet, so a later run never undoes an edit)
update articles set category = 'veseliba' where category is null and (
  slug in ('finansiala-veseliba', 'viriesa-labsajuta-gimene', 'movember-vairak-neka-usas')
  or slug like 'fenikss-novembri-aicina-virus%'
  or slug like 'rupes-par-fiziskam-aktivitatem%'
);
update articles set category = 'speles' where category is null and (
  slug in ('ievads-latvijas-cempionata-regbija-7', 'valmieras-regbisti-uzsak-latvijas-cempionatu')
  or slug like 'fenikss-sava-laukuma-uznems%'
  or slug like 'ieludzam-uz-draudzibas-speli%'
);
update articles set category = 'pasakumi' where category is null and (
  slug like 'fenikss-aicina-uz-atverto-regbija-treninu%'
  or slug like 'regbija-kluba-fenikss-treninnometne%'
);
update articles set category = 'klubs' where category is null and (
  slug in ('pievienojies-atbalsta-kampanai', 'aprilis-ir-autismam-veltits-menesis', 'rk-fenikss-laukuma-izveide')
);

-- Check: every published article should have a category now
select slug, category from articles where status = 'published' order by published_at desc;
