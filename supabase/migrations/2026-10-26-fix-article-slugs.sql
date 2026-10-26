-- Readable article URLs: old articles got slugs from an earlier generator that dropped
-- Latvian letters ("fnikss", "aprlis"). Those slugs were never used in links, so they are
-- rewritten to match lib/articles.ts slugify(). Each row is matched on its old slug too,
-- so running this again (or after a manual edit) changes nothing.

update articles set slug = 'pievienojies-atbalsta-kampanai' where id = 'd0ec5673-d634-4580-9337-764b12ed4ab6' and slug = 'pievienojies-atbalsta-kampaai';
update articles set slug = 'fenikss-aicina-uz-atverto-regbija-treninu-priekulos' where id = 'd92b925f-ca95-4a8f-99fc-d16a57b73472' and slug = 'fnikss-aicina-uz-atvrto-regbija-treniu-priekuos';
update articles set slug = 'fenikss-sava-laukuma-uznems-regbija-klubu-no-garkalnes-livonija' where id = '1202bdf0-9f9f-4d7f-b0a4-b8796d976da9' and slug = 'fnikss-sav-laukum-uzems-regbija-klubu-no-garkalnes-livonija';
update articles set slug = 'ieludzam-uz-draudzibas-speli-brengulos-7-junija-plkst-14-00' where id = 'a98b5a5b-6943-48b8-a441-0ebf62dac88b' and slug = 'ieldzam-uz-draudzbas-spli-brenguos-7-jnij-plkst-1400';
update articles set slug = 'ievads-latvijas-cempionata-regbija-7' where id = 'dfe9fd58-ead7-4359-b70c-4d7a30e47bb2' and slug = 'ievads-latvijas-empiont-regbij-7';
update articles set slug = 'valmieras-regbisti-uzsak-latvijas-cempionatu' where id = '5b45ba5a-5493-4ba2-895a-374fe59c0885' and slug = 'valmieras-regbisti-uzsk-latvijas-empiontu';
update articles set slug = 'aprilis-ir-autismam-veltits-menesis' where id = 'af033afd-6ebe-4964-8860-4a0fc91ce51f' and slug = 'aprlis-ir-autismam-veltts-mnesis-';
update articles set slug = 'rk-fenikss-laukuma-izveide' where id = 'b4fd8c84-d619-4000-add5-fb8cc29e2b7a' and slug = 'rk-fnikss-laukuma-izveide';
update articles set slug = 'regbija-kluba-fenikss-treninnometne-anglija-londona' where id = '13922f57-cc37-4366-911e-2a9dad6cb414' and slug = 'regbija-kluba-fnikss-treninometne-anglij-london';
