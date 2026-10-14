import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase'
import { requireAdminPage } from '@/lib/require-admin-page'
import { FixtureForm, type FixtureRow } from '@/components/admin/fixtures/fixture-form'
import type { TeamRow } from '@/components/admin/fixtures/team-dialog'

export const dynamic = 'force-dynamic'

export default async function EditFixturePage({ params }: { params: { id: string } }) {
  await requireAdminPage()
  const db = createAdminClient()
  const [fixture, teams] = await Promise.all([
    db.from('fixtures').select('*').eq('id', params.id).maybeSingle(),
    db.from('teams').select('id, name, logo_url').order('name'),
  ])
  if (!fixture.data) notFound()
  return <FixtureForm initial={fixture.data as FixtureRow} teams={(teams.data ?? []) as TeamRow[]} />
}
