import { z } from 'zod'

// Optional text: trimmed, empty becomes null
const optionalText = (max: number) =>
  z.string().trim().max(max, `Ne vairāk kā ${max} rakstzīmes`).transform((v) => (v === '' ? null : v)).nullable().optional()

const photoUrl = z.string().url('Nederīga saite').nullable().optional()
const time = z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Ievadi laiku')

export const playerSchema = z.object({
  name: z.string().trim().min(1, 'Ievadi vārdu').max(255),
  jersey_number: z.number().int().min(0, 'Numuram jābūt no 0 līdz 99').max(99, 'Numuram jābūt no 0 līdz 99').nullable().optional(),
  position: optionalText(100),
  bio: optionalText(5000),
  image_url: photoUrl,
  is_active: z.boolean(),
})

export const coachSchema = z.object({
  name: z.string().trim().min(1, 'Ievadi vārdu').max(255),
  role: optionalText(100),
  bio: optionalText(5000),
  image_url: photoUrl,
  is_active: z.boolean(),
})

export const trainingSchema = z
  .object({
    day_of_week: z.number().int().min(0).max(6),
    start_time: time,
    end_time: time,
    location: z.string().trim().min(1, 'Ievadi vietu').max(255),
    team_group: optionalText(100),
    description: optionalText(1000),
    is_active: z.boolean(),
  })
  .refine((t) => t.end_time.slice(0, 5) > t.start_time.slice(0, 5), { message: 'Beigām jābūt pēc sākuma', path: ['end_time'] })

export const teamSchema = z.object({
  name: z.string().trim().min(1, 'Ievadi komandas nosaukumu').max(120),
  logo_url: photoUrl,
})

export const fixtureSchema = z.object({
  opponent: z.string().trim().min(1, 'Izvēlies pretinieku').max(255),
  match_date: z.string().datetime({ offset: true, message: 'Ievadi datumu un laiku' }),
  is_home_game: z.boolean(),
  location: optionalText(255),
  score: optionalText(20),
  result: z.enum(['win', 'loss', 'draw']).nullable().optional(),
  description: optionalText(2000),
  home_logo_url: photoUrl,
  away_logo_url: photoUrl,
})

export const galleryCreateSchema = z.object({
  title: z.string().trim().min(1, 'Ievadi nosaukumu').max(255),
  description: optionalText(5000),
})

export const galleryUpdateSchema = z.object({
  title: z.string().trim().min(1, 'Ievadi nosaukumu').max(255).optional(),
  description: optionalText(5000),
  cover_image_url: photoUrl,
})

export const galleryImageCreateSchema = z.object({
  image_url: z.string().url(),
  display_order: z.number().int().min(0),
})

export const galleryImageUpdateSchema = z.object({ caption: optionalText(255) })

export const galleryOrderSchema = z.object({ ids: z.array(z.string().uuid()).max(2000) })

export type PlayerInput = z.infer<typeof playerSchema>
export type CoachInput = z.infer<typeof coachSchema>
export type TrainingInput = z.infer<typeof trainingSchema>
export type TeamInput = z.infer<typeof teamSchema>
export type FixtureInput = z.infer<typeof fixtureSchema>

// First message per field, for showing next to the inputs
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form')
    if (!out[key]) out[key] = issue.message
  }
  return out
}
