import { createAdminClient } from '@/lib/supabase'
import { requireAdminPage } from '@/lib/require-admin-page'
import { PeopleList, type PersonRow } from '@/components/admin/people/people-list'

export const dynamic = 'force-dynamic'

export default async function CoachsPage() {
  await requireAdminPage()
  const { data } = await createAdminClient()
    .from('coaches')
    .select('id, name, image_url, is_active, role')
    .order('name')
  return <PeopleList kind="coach" rows={(data ?? []) as PersonRow[]} />
}
