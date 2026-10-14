import { listAndCreate } from '@/lib/admin-crud'
import { fixtureSchema } from '@/lib/admin-schemas'

export const dynamic = 'force-dynamic'

export const { GET, POST } = listAndCreate({ table: 'fixtures', schema: fixtureSchema, order: [{ column: 'match_date', ascending: false }], label: 'spēli' })
