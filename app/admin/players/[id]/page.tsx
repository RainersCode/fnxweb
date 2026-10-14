import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase'
import { requireAdminPage } from '@/lib/require-admin-page'
import { PersonForm } from '@/components/admin/people/person-form'

export const dynamic = 'force-dynamic'

export default async function EditPlayerPage({ params }: { params: { id: string } }) {
  await requireAdminPage()
  const { data } = await createAdminClient().from('team_players').select('*').eq('id', params.id).maybeSingle()
  if (!data) notFound()
  return <PersonForm kind="player" initial={data} />
}
