import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase'
import { requireAdminPage } from '@/lib/require-admin-page'
import { TrainingForm } from '@/components/admin/training/training-form'
import type { TrainingRow } from '@/components/admin/training/training-list'

export const dynamic = 'force-dynamic'

export default async function EditTrainingPage({ params }: { params: { id: string } }) {
  await requireAdminPage()
  const { data } = await createAdminClient().from('training_sessions').select('*').eq('id', params.id).maybeSingle()
  if (!data) notFound()
  return <TrainingForm initial={data as TrainingRow} />
}
