import { listAndCreate } from '@/lib/admin-crud'
import { playerSchema } from '@/lib/admin-schemas'

export const dynamic = 'force-dynamic'

export const { GET, POST } = listAndCreate({
  table: 'team_players',
  schema: playerSchema,
  order: [{ column: 'jersey_number', ascending: true, nullsFirst: false }, { column: 'name' }],
  imageField: 'image_url',
  label: 'spēlētāju',
})
