import { createAdminClient } from '@/lib/supabase'
import { requireAdminPage } from '@/lib/require-admin-page'
import { PeopleList, type PersonRow } from '@/components/admin/people/people-list'

export const dynamic = 'force-dynamic'

export default async function PlayersPage() {
  await requireAdminPage()
  const { data } = await createAdminClient()
    .from('team_players')
    .select('id, name, image_url, is_active, jersey_number, position')
    .order('jersey_number', { ascending: true, nullsFirst: false })
    .order('name')
  return <PeopleList kind="player" rows={(data ?? []) as PersonRow[]} />
}
