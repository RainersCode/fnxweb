import { listAndCreate } from '@/lib/admin-crud'
import { coachSchema } from '@/lib/admin-schemas'

export const dynamic = 'force-dynamic'

export const { GET, POST } = listAndCreate({
  table: 'coaches',
  schema: coachSchema,
  order: [{ column: 'name' }],
  imageField: 'image_url',
  label: 'treneri',
})
