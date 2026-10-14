import { createAdminClient } from '@/lib/supabase'
import { requireAdminPage } from '@/lib/require-admin-page'
import { FixtureForm } from '@/components/admin/fixtures/fixture-form'
import type { TeamRow } from '@/components/admin/fixtures/team-dialog'

export const dynamic = 'force-dynamic'

export default async function NewFixturePage() {
  await requireAdminPage()
  const { data } = await createAdminClient().from('teams').select('id, name, logo_url').order('name')
  return <FixtureForm teams={(data ?? []) as TeamRow[]} />
}
