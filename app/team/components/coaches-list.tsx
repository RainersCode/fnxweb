import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'

export default async function CoachesList() {
  const supabase = createClient()

  // Fetch all active coaches from the database
  const { data: coaches, error } = await supabase
    .from('coaches')
    .select('*')
    .eq('is_active', true)
    .order('name')

  if (error) {
    console.error('Error fetching coaches:', error)
    return <div className="p-8 text-center">Failed to load coaches. Please try again later.</div>
  }

  if (!coaches || coaches.length === 0) {
    return <div className="p-8 text-center">No coaches found.</div>
  }

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
      {coaches.map((coach) => (
        <div
          key={coach.id}
          className="transform overflow-hidden bg-white shadow-md transition-all duration-300 hover:scale-[1.02]"
        >
          <div className="relative h-80">
            <Image
              src={coach.image_url || '/placeholder.svg?height=400&width=300&text=Coach'}
              alt={coach.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-teal-900">{coach.name}</h3>
            <p className="mb-4 font-medium text-teal-700">{coach.role || 'Coaching Staff'}</p>
            <p className="text-sm text-zinc-600">{coach.bio || 'No biography available.'}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
