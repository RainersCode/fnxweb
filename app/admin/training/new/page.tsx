import { requireAdminPage } from '@/lib/require-admin-page'
import { TrainingForm } from '@/components/admin/training/training-form'

export const dynamic = 'force-dynamic'

export default async function NewTrainingPage() {
  await requireAdminPage()
  return <TrainingForm />
}
