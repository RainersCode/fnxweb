import { itemRoutes } from '@/lib/admin-crud'
import { playerSchema } from '@/lib/admin-schemas'

export const dynamic = 'force-dynamic'

export const { GET, PATCH, DELETE } = itemRoutes({
  table: 'team_players',
  schema: playerSchema,
  order: [],
  imageField: 'image_url',
  label: 'spēlētāju',
})
