export function MigrationNotice() {
  return (
    <div className="rounded-lg border border-[#F0C828] bg-[#FFF8E1] p-5">
      <p className="font-semibold">Datubāzei vajadzīgs atjauninājums</p>
      <p className="mt-1 text-sm text-[#5B6863]">
        Supabase SQL redaktorā palaid failu <code>supabase/migrations/2026-10-13-articles-publishing.sql</code> un pārlādē lapu.
      </p>
    </div>
  )
}
