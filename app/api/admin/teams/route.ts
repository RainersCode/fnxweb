import { listAndCreate } from '@/lib/admin-crud'
import { teamSchema } from '@/lib/admin-schemas'

export const dynamic = 'force-dynamic'

export const { GET, POST } = listAndCreate({ table: 'teams', schema: teamSchema, order: [{ column: 'name' }], label: 'komandu' })
