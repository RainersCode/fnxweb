import { itemRoutes } from '@/lib/admin-crud'
import { trainingSchema } from '@/lib/admin-schemas'

export const dynamic = 'force-dynamic'

export const { GET, PATCH, DELETE } = itemRoutes({ table: 'training_sessions', schema: trainingSchema, order: [], label: 'treniņu' })
