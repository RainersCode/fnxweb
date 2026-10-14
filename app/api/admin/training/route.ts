import { listAndCreate } from '@/lib/admin-crud'
import { trainingSchema } from '@/lib/admin-schemas'

export const dynamic = 'force-dynamic'

export const { GET, POST } = listAndCreate({
  table: 'training_sessions',
  schema: trainingSchema,
  order: [{ column: 'day_of_week' }, { column: 'start_time' }],
  label: 'treniņu',
})
