# Admin redesign, step 2: galleries, matches, players, coaches, training

Date: 2026-10-14
Status: approved in conversation, awaiting written-spec review
Builds on: `docs/superpowers/specs/2026-10-13-admin-articles-design.md` (step 1, live)

## Goal

Bring the remaining admin sections (Galerijas, Spēles, Spēlētāji, Treneri, Treniņi) to the same standard as the new article editor: Latvian, phone-friendly, full pages instead of pop-up dialogs, clear feedback. Galleries must handle both a photographer's 50–150+ photos from a computer and a handful from a phone. Matches remember opponent teams and their logos. Training times entered in the admin finally appear on the public site.

## Users and access

Unchanged from step 1: everyone on `ALLOWED_EMAILS`, same rights. Every new admin page calls `requireAdminPage()`; every new or changed `/api/admin/*` handler calls `isAdminRequest()` first and validates input with zod (unknown fields dropped).

## Scope

In step 2:
- Galerijas: list, gallery page with bulk upload queue, reorder, cover, captions, multi-delete.
- Spēles: list (upcoming / played), form with opponent team picker; teams table with logos.
- Spēlētāji, Treneri, Treniņi: list + full-page form.
- Shared admin building blocks (list page, form page, photo field, upload queue).
- Upload limits: longest side, browser-side shrinking for every admin upload.
- Public site: gallery cover; training times block on Kontakti, Klubs and the home page join section.
- One SQL migration.
- Removal of the old dialog-based pages and the old shared uploaders once nothing uses them.

Not planned: competition field on matches, one-tap result entry, manual ordering of players/coaches (order stays automatic: players by jersey number, coaches by name, as today), linking galleries to matches.

## Shared building blocks

- `AdminListPage`: page title, "+ Jauns…" primary button, search box, optional filter tabs, rows on desktop and cards on phones, empty state in Latvian.
- `AdminFormPage`: sticky top bar (← back to list, title, delete with confirmation, primary **Saglabāt**), form body, unsaved-changes guard (closing the tab or following a link asks "Ir nesaglabātas izmaiņas. Iziet bez saglabāšanas?"), field-level Latvian validation messages from zod, toast on success ("Saglabāts") then back to the list.
- `PhotoField`: generalised from the article `CoverPhotoField` — tap or drag to choose, real progress, "Mainīt" / "Noņemt", aspect ratio per use (portrait 4:5 for people, square for team logos, 16:7 for article covers).
- Short forms save explicitly; no autosave outside articles.
- All feedback via sonner toasts; no `alert()`.

## Galerijas

List (`/admin/gallery`): grid of cards (cover, title, photo count, date), "+ Jauna galerija" (creates the gallery after a title is entered in a small inline form, then opens it). One column on phones.

Gallery page (`/admin/gallery/[id]`):
- Top bar: ← Galerijas, "Skatīt mājaslapā" (`/gallery/[id]`, new tab), delete gallery with confirmation (deletes its photos' files too).
- Fields: title (required), description (optional), saved with **Saglabāt** like other forms.
- Upload area: "Ievelc foto šeit vai izvēlies" drop zone on desktop (multiple files), the normal multi-select photo picker on phones.
- Upload queue:
  - Selected files are sorted by file name (natural sort, so `DSC_2` comes before `DSC_10`) and shown immediately as local previews.
  - Up to 3 uploads run at once, each with real progress; a header shows "Augšupielādē 37 no 120".
  - Each finished photo is saved to the gallery straight away (one `gallery_images` row), appended after the current last photo, so an interrupted batch keeps everything already uploaded.
  - Failed photos stay in the queue marked "Neizdevās" with the server's Latvian message and a "Mēģināt vēlreiz" button; "Mēģināt vēlreiz visus" retries all failures.
  - Leaving the page while uploads are running asks for confirmation.
- Photo grid:
  - Drag to reorder (mouse on desktop; press-and-hold then drag on phones). The new order is saved automatically after the drop.
  - Per photo: "Padarīt par vāku" (cover shows a star badge), caption (saved when the field loses focus, not per keystroke), delete.
  - Select mode: tick several photos and delete them together, with confirmation.
- Cover: stored on the gallery (`cover_image_url`). If no cover is chosen, or the chosen photo is deleted, the first photo by order is used.

## Spēles

List (`/admin/fixtures`): tabs "Gaidāmās" (match date in the future) and "Aizvadītās" (past); rows show date and time, "Fēnikss v Eži" (home/away order), venue, and for played matches the score and a result pill (Uzvara / Zaudējums / Neizšķirts).

Form (`/admin/fixtures/new`, `/admin/fixtures/[id]`):
- Pretinieks: searchable team picker showing logos; "+ Jauna komanda" adds a team (name, optional logo) inline and selects it.
- Mājas / Izbraukumā toggle; date and time; venue (free text).
- Result section (shown only when the match date is in the past): score (free text, e.g. "24:17"), result select (Uzvara / Zaudējums / Neizšķirts / Nav).
- Description (optional).
- On save the picked team's name and logo are copied into the match's existing fields (`opponent`, and `home_logo_url` / `away_logo_url` by home/away; the Fēnikss side uses the club logo). Public pages keep reading those fields unchanged.
- Teams can be renamed or given a new logo from the picker; existing matches keep the values copied at their last save.

## Spēlētāji and Treneri

Players list (`/admin/players`): photo, name, number, position; filter "Aktīvie / Neaktīvie / Visi"; sorted by number then name.
Player form: photo (portrait), name (required), jersey number (optional, 0–99), position (free text with suggestions of standard rugby positions in Latvian), bio, "Aktīvs" switch.

Coaches list (`/admin/coaches`) and form: same pattern with role instead of number and position.

Replacing or removing a photo deletes the old file only after a successful save.

## Treniņi

List (`/admin/training`): grouped by weekday (Pirmdiena…Svētdiena), each row start–end time, place, group, active state.
Form: weekday, start time, end time (must be after start), place (required), group (Pieaugušie / Juniori / Bērni or free text), note, "Aktīvs" switch.

## Public site changes

- Gallery cover: home page gallery section, `/gallery` list and the article page's gallery cards use `cover_image_url`, falling back to the first photo by `display_order`.
- Training times block ("Treniņu laiki"): active sessions grouped by day, showing time, place and group. Shown on `/contact`, `/about` and inside the home page's "Nāc uz treniņu / Pievienojies Fēniksam" section. Hidden entirely when there are no active sessions. Read on the server with the anon client and revalidated every 60 seconds.

## Data model

Migration `supabase/migrations/2026-10-14-admin-step2.sql`, run once by the owner, safe to repeat:

```sql
alter table galleries add column if not exists cover_image_url text;

create table if not exists teams (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  logo_url text,
  created_at timestamptz not null default now()
);
alter table teams enable row level security;  -- admin uses the service role; no public access needed

-- Fill the team list from existing matches (one row per opponent name, newest logo wins)
insert into teams (name, logo_url)
select distinct on (opponent) opponent,
  case when is_home_game then away_logo_url else home_logo_url end
from fixtures
where opponent is not null and opponent <> ''
order by opponent, match_date desc
on conflict (name) do nothing;

-- Public pages read active training sessions with the anon key
alter table training_sessions enable row level security;
drop policy if exists "Public can read active training" on training_sessions;
create policy "Public can read active training" on training_sessions
  for select to anon, authenticated using (is_active = true);
```

`types/supabase.ts`: `Gallery` gains `cover_image_url?: string | null`; new `Team = { id: string; name: string; logo_url: string | null; created_at: string }`.

## Photos and storage

- Server (`/api/admin/upload`): resize to fit inside 1920×1920 (longest side 1920, no enlargement), WebP quality 80. Applies to every upload, articles included.
- Browser: every admin upload goes through `uploadWithProgress`, which shrinks JPEG/PNG/WebP photos over 3.5 MB to at most 2560 px before sending (Vercel's 4.5 MB request limit).
- Folders: `galleries/<galleryId>`, `players`, `coaches`, `teams`, `articles/<articleId>` (unchanged).
- Deleting a gallery photo deletes its file; deleting a gallery deletes all its photos' files (by stored URL, which also covers older photos in the flat `galleries` folder). Storage removal failures are logged and do not undo the database delete.

## API

New or rewritten admin routes, all `isAdminRequest()` + zod:
- `/api/admin/gallery` (GET list with photo counts and cover, POST create), `/api/admin/gallery/[id]` (GET with photos ordered by `display_order`, PATCH title/description/cover, DELETE with file cleanup), `/api/admin/gallery/[id]/images` (POST add one photo after upload), `/api/admin/gallery/[id]/images/[imageId]` (PATCH caption, DELETE with file cleanup), `/api/admin/gallery/[id]/order` (PUT the full ordered list of image ids).
- `/api/admin/teams` (GET, POST), `/api/admin/teams/[id]` (PATCH).
- `/api/admin/fixtures`, `/api/admin/players`, `/api/admin/coaches`, `/api/admin/training`: list + create; `/[id]`: get, update, delete. Ids move from the request body to the URL, like articles.

## Testing

- Vitest for pure logic: natural file-name sort, upload queue state (concurrency limit 3, success, failure, retry, counts), reorder → `display_order` mapping, cover fallback, team backfill/name normalisation helpers, training grouping and time validation, fixture tab split (upcoming/played), zod schemas for each form.
- Screenshot checks of each admin list and form at 1440 px and 390 px (signed in by the owner), and of `/contact`, `/about` and the home page training block.
- Owner checklist on the preview deployment: create a gallery, upload a large batch and a phone handful, reorder, set a cover, delete photos; add a match with a new team, edit a played match's result; add/edit a player, coach and training session; check the public pages.

## Rollout

1. Owner runs `supabase/migrations/2026-10-14-admin-step2.sql`.
2. Build on branch `admin-step2`; owner tests on the preview deployment.
3. Merge to `main`.
