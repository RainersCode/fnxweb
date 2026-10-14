import { itemRoutes } from '@/lib/admin-crud'
import { fixtureSchema } from '@/lib/admin-schemas'

export const dynamic = 'force-dynamic'

export const { GET, PATCH, DELETE } = itemRoutes({ table: 'fixtures', schema: fixtureSchema, order: [], label: 'spēli' })
