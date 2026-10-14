import { createAdminClient } from '@/lib/supabase'
import { requireAdminPage } from '@/lib/require-admin-page'
import { TrainingList, type TrainingRow } from '@/components/admin/training/training-list'

export const dynamic = 'force-dynamic'

export default async function TrainingPage() {
  await requireAdminPage()
  const { data } = await createAdminClient().from('training_sessions').select('*').order('day_of_week').order('start_time')
  return <TrainingList rows={(data ?? []) as TrainingRow[]} />
}
