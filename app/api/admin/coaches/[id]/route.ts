import { itemRoutes } from '@/lib/admin-crud'
import { coachSchema } from '@/lib/admin-schemas'

export const dynamic = 'force-dynamic'

export const { GET, PATCH, DELETE } = itemRoutes({
  table: 'coaches',
  schema: coachSchema,
  order: [],
  imageField: 'image_url',
  label: 'treneri',
})
