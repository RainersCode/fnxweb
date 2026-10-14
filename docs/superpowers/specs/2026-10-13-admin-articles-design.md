# Admin redesign, step 1: admin shell and article editor

Date: 2026-10-13
Status: approved in conversation, awaiting written-spec review

## Goal

Replace the current admin area with a professional, Latvian-language admin that a non-technical club member can use on a phone or a computer. Step 1 delivers the admin shell (layout, navigation, dashboard) and a new article workflow. Posting a match report with photos from a phone right after a game must feel easy.

## Users and access

- Users: the site owner and one or more teammates. Everyone on the `ALLOWED_EMAILS` list has the same rights. There are no roles and no approval step; everyone can save drafts and publish.
- Access control is already in place (`lib/admin-auth.ts`, merged in PR #5). Every new admin page, server action and API route must call `isAdminRequest()` server-side; the middleware check is a second layer, not the only one.

## Scope

In step 1:
- Admin shell: own layout, desktop sidebar, phone bottom tab bar, floating "+" button.
- Dashboard (`/admin`).
- Article list (`/admin/articles`) and full-page editor (`/admin/articles/new`, `/admin/articles/[id]`).
- Admin-only article preview.
- Database changes for articles; public pages updated to respect drafts and scheduling.
- Article page shows the linked match and gallery.

Later steps (out of scope here):
- Step 2: galleries (drag-and-drop upload with real progress, reordering, cover choice).
- Step 3: players, coaches, fixtures, training.
- Until then the existing pages for those sections keep working, rendered inside the new shell.

Not planned: roles or approvals, comments, multi-language content, version history.

## Admin shell

- `app/admin/layout.tsx` stops using the public `MainLayout` and renders a dedicated admin layout.
- Desktop (≥ 1024px): left sidebar on club deep green with: Sākums, Ziņas, Galerijas, Spēles, Spēlētāji, Treneri, Treniņi. At the bottom: "Skatīt mājaslapu" (opens the site in a new tab) and the Clerk user menu with log-out.
- Phone and tablet: top bar with the page title; bottom tab bar with Sākums, Ziņas, Galerijas, Vairāk ("Vairāk" opens a sheet with the remaining sections and "Skatīt mājaslapu"); a round teal "+" button above the tab bar that opens "Jauna ziņa" / "Pievienot foto".
- All admin text is Latvian. Colours follow the site palette (`club` tokens in `tailwind.config.ts`); the primary action button is teal like the public site.
- Built from the existing shadcn components in `components/ui` (sidebar, sheet, tabs, dropdown, sonner for toasts, form + zod).

## Dashboard (`/admin`)

1. Quick actions: "Jauna ziņa" and "Pievienot foto" (the latter links to the current gallery page until step 2).
2. "Turpināt rakstīt": the newest drafts (title, last edited time), each opening the editor.
3. "Ieplānots": scheduled articles with their publish time.
4. "Nesen publicēts": the latest published articles with a "Skatīt ↗" link to the live page.
5. Visitor statistics: the existing page-view stats, in a compact card.

## Article list (`/admin/articles`)

- Filters: Visas, Melnraksti, Ieplānotas, Publicētas, each with a count. Search by title.
- Each row (card on a phone): cover thumbnail, title, author and last-edited time, status pill, link to the live page when visible.
- Status pills: amber "Melnraksts", blue "Ieplānots · 18. okt 10:00", green "Publicēts".
- "+ Jauna ziņa" in the header.

## Article editor

Full page, not a dialog.

Top bar: "← Ziņas", status pill, autosave state ("Saglabā…", "✓ Saglabāts 14:32", or an error), "Priekšskatīt", primary "Publicēt" (reads "Ieplānot" when a future time is set, "Atjaunināt" for an already published article).

Writing area, in order:
1. Cover photo field. Tap to choose; drag and drop on desktop. Shows real upload progress. "Mainīt" and "Noņemt" actions.
2. Title, large, auto-growing.
3. Body (TipTap). Toolbar: heading (H2/H3), bold, italic, bullet list, numbered list, quote, link, "+ Foto", "+ Video". On a phone the toolbar is fixed above the on-screen keyboard. Links are added through a small popover, not `window.prompt`.
   - Photos in the body: from the toolbar, by drag and drop, or by paste. A placeholder with a progress bar appears at the cursor while uploading. Optional caption under each photo.
   - Video: "+ Video" opens a field "Ielīmē YouTube vai Facebook saiti". Only YouTube and Facebook video URLs are accepted; anything else shows "Šī saite netiek atbalstīta".

Settings: a right-hand column on desktop, a "Iestatījumi" sheet on a phone.
- Publicēšana: "Tagad" or "Ieplānot" with date and time (Europe/Riga). For a published article this shows its publish date, which can be changed.
- Īss apraksts (excerpt): up to 160 characters, with a counter. If left empty, the first sentence of the body is used on cards and in meta descriptions.
- Saistītā spēle: select from fixtures (newest first, shown as "Fēnikss v Eži · 18. okt").
- Saistītā galerija: select from galleries.
- Autors: free text, prefilled with the logged-in user's name from Clerk.
- Izcelt sākumlapā (is_featured).
- "Pārvērst par melnrakstu" (unpublish) for published or scheduled articles.
- "Dzēst ziņu" with a confirmation dialog.

Behaviour:
- Creating: "+ Jauna ziņa" creates a draft row immediately (empty title allowed for drafts) and opens its editor, so autosave always has an id.
- Autosave: 2 seconds after the last change, the draft fields are saved. A saved published article is not changed by autosave; edits to a published article are kept as unsaved changes in the editor until "Atjaunināt", so a half-written correction never goes live.
- Offline and failure: every change is also written to `localStorage` under the article id. If a save fails, the editor shows "Neizdevās saglabāt — mēģina vēlreiz" and retries with backoff. On opening, if the local copy is newer than the database row, the editor offers "Atjaunot nesaglabātās izmaiņas".
- Publish validation: title required, body not empty. Missing cover photo shows a warning but does not block.
- After publishing: toast "Publicēts" with "Skatīt mājaslapā"; after scheduling: "Ieplānots uz 18. okt 10:00".
- Leaving with unsaved changes on a published article asks for confirmation.

## Preview

- Route `/admin/articles/[id]/preview`, admin-only, renders the article with the same component as the public article page, including drafts and scheduled articles.
- A bar at the top says "Priekšskatījums — šī ziņa vēl nav publicēta" (or "…publicēta" for live ones) with "← Atpakaļ uz redaktoru".

## Data model

Migration file `supabase/migrations/2026-10-13-articles-publishing.sql`, run once by the owner in the Supabase SQL editor (or via the Supabase MCP if connected):

```sql
alter table articles add column if not exists status text not null default 'published'
  check (status in ('draft', 'published'));
alter table articles add column if not exists excerpt text;
alter table articles add column if not exists fixture_id uuid references fixtures(id) on delete set null;
alter table articles add column if not exists gallery_id uuid references galleries(id) on delete set null;
alter table articles alter column title drop not null;
alter table articles alter column content set default '';
create index if not exists articles_visible_idx on articles (status, published_at desc);
```

- Existing rows become `status = 'published'`, so nothing disappears from the site.
- `title` becomes nullable so a fresh draft can exist before it has a title; publishing still requires one.
- `published_at` keeps its default and becomes editable; a future value means scheduled.
- `types/supabase.ts` `Article` gains `status`, `excerpt`, `fixture_id`, `gallery_id`.
- The app must keep working before the migration runs: until then, admin pages show a clear message ("Datubāzei vajadzīgs atjauninājums") instead of failing silently.

## Visibility rule (one place)

- An article is publicly visible when `status = 'published'` and `published_at <= now()`.
- Implemented once as a query helper in `lib/articles.ts` (e.g. `visibleArticles(query)`) and used by all five public readers: `app/page.tsx`, `app/news/page.tsx`, `app/news/[id]/page.tsx`, `app/news/[id]/opengraph-image.tsx`, `app/sitemap.ts`. Also replace or delete the unused readers in `lib/api.ts`.
- A non-visible article id on `/news/[id]` returns `notFound()`.
- Public pages already revalidate every 60 seconds, so a scheduled article appears within about a minute of its time. No cron job.

## Slugs

- Generated once at first publish from the title, transliterating Latvian letters (ā→a, č→c, ē→e, ģ→g, ī→i, ķ→k, ļ→l, ņ→n, š→s, ū→u, ž→z), lowercased, non-alphanumerics to hyphens, deduplicated with a numeric suffix.
- Never regenerated on edit and not shown in the UI. Existing slugs are untouched. Public URLs stay `/news/[id]`.

## Public article page

- Under the article body: if `fixture_id` is set, a match card ("Spēle: Fēnikss v Eži · 18. okt", score if played) linking to `/fixtures`; if `gallery_id` is set, a "Skatīt foto galeriju" card linking to `/gallery/[id]`.
- Cards and meta description use `excerpt` when present.
- Article HTML is sanitized before rendering (see Safety).

## Photos

- Uploads reuse `/api/admin/upload` (sharp: max 1920px wide, WebP quality 80, 10 MB limit). Article photos go to `media/articles/<articleId>/`.
- Uploads use `XMLHttpRequest` so the progress bar shows real progress.
- iPhone HEIC photos: if sharp cannot decode them, the upload route returns a clear error ("Šo foto formātu nevar apstrādāt — izvēlies JPG vai PNG"); the editor shows it as a toast.
- Removing or replacing a photo never deletes the stored file immediately. Files are cleaned up only when an article is deleted (all files under its folder).

## Video embeds

- Accepted inputs: `youtube.com/watch?v=…`, `youtu.be/…`, `youtube.com/shorts/…`, and `facebook.com/…/videos/…` / `fb.watch/…`.
- Stored in the body as an iframe node with a normalized embed URL (`https://www.youtube-nocookie.com/embed/<id>`, Facebook's `plugins/video.php?href=…`), responsive 16:9.

## Safety

- Article HTML is sanitized on save (server) and on render (public page) with an allowlist: paragraphs, headings h2–h4, strong/em/u, lists, blockquote, links (http/https/mailto, `rel="noopener noreferrer"` on external), images from the Supabase media bucket, figure/figcaption, and iframes only from the YouTube-nocookie and Facebook video embed hosts.
- Server-side validation of every write with zod; unknown fields are dropped (today the API inserts the request body as-is).

## Errors and feedback

- All feedback through sonner toasts in Latvian; no `alert()`, no silent `console.error`.
- Form validation messages next to the fields.
- Loading states with skeletons for lists; disabled buttons while saving.

## Code structure

- `app/admin/layout.tsx`: auth check plus `AdminShell`.
- `components/admin/shell/`: `admin-shell.tsx`, `admin-sidebar.tsx`, `admin-tab-bar.tsx`, `quick-add-button.tsx`.
- `components/admin/articles/`: `article-list.tsx`, `article-status-pill.tsx`, `article-editor.tsx`, `editor-toolbar.tsx`, `article-settings.tsx`, `cover-photo-field.tsx`, `video-embed-dialog.tsx`, `use-autosave.ts`.
- `lib/articles.ts`: visibility helper, slug generation, excerpt fallback.
- `lib/sanitize-article.ts`: the HTML allowlist (shared by server save and public render).
- `lib/video-embed.ts`: URL parsing and normalization.
- `lib/upload-with-progress.ts`: XHR upload helper.
- All article reads and writes from the admin go through API routes, matching the rest of the admin: `app/api/admin/articles/route.ts` (list, create draft) and `app/api/admin/articles/[id]/route.ts` (get, autosave/update, publish, unpublish, delete). Both validate with zod and call `isAdminRequest()`.
- `components/shared/rich-text-editor.tsx` is replaced by the new editor for articles; remove it once nothing imports it.
- Old pages for galleries, fixtures, players, coaches and training stay as they are, rendered inside the new shell.

## Testing

- Add Vitest (unit tests only) with tests for: slug generation (including Latvian letters and duplicates), video URL parsing (accepted and rejected inputs), HTML sanitizing (scripts, event handlers, foreign iframes removed; allowed content kept), the visibility rule (draft, scheduled, published in the past), and excerpt fallback.
- Screenshot checks of the admin screens at 1440px and 390px on the local dev server.
- Logged-in flows (write, autosave, publish, schedule, unpublish, delete, preview) are tested by the owner on localhost and on the Vercel preview before merging; a short checklist is included in the pull request.

## Rollout

1. Merge the migration file and code on a branch; the owner runs the SQL.
2. Owner tests on the preview deployment.
3. Merge to `main` to go live.
4. Add the teammate: invite them in Clerk (sign-up mode Restricted) and add their email to `ALLOWED_EMAILS` in Vercel.
