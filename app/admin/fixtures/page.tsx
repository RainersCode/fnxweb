import { createAdminClient } from '@/lib/supabase'
import { requireAdminPage } from '@/lib/require-admin-page'
import { FixtureList } from '@/components/admin/fixtures/fixture-list'
import type { FixtureRow } from '@/components/admin/fixtures/fixture-form'

export const dynamic = 'force-dynamic'

export default async function FixturesPage() {
  await requireAdminPage()
  const { data } = await createAdminClient().from('fixtures').select('*').order('match_date', { ascending: false })
  return <FixtureList rows={(data ?? []) as FixtureRow[]} />
}
