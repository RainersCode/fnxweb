import { itemRoutes } from '@/lib/admin-crud'
import { teamSchema } from '@/lib/admin-schemas'

export const dynamic = 'force-dynamic'

// No imageField: matches keep copies of team logo URLs, so logo files are never deleted
export const { GET, PATCH, DELETE } = itemRoutes({ table: 'teams', schema: teamSchema, order: [], label: 'komandu' })
