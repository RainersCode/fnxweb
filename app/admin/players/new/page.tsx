import { requireAdminPage } from '@/lib/require-admin-page'
import { PersonForm } from '@/components/admin/people/person-form'

export const dynamic = 'force-dynamic'

export default async function NewPlayerPage() {
  await requireAdminPage()
  return <PersonForm kind="player" />
}
