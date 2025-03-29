import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'

export default async function PlayersList() {
  const supabase = createClient()

  // Fetch all active players from the database
  const { data: players, error } = await supabase
    .from('team_players')
    .select('*')
    .eq('is_active', true)
    .order('jersey_number', { ascending: true })
    .order('name')

  if (error) {
    console.error('Error fetching players:', error)
    return <div className="p-8 text-center">Failed to load players. Please try again later.</div>
  }

  if (!players || players.length === 0) {
    return <div className="p-8 text-center">No players found.</div>
  }

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {players.map((player) => (
        <div
          key={player.id}
          className="transform overflow-hidden bg-white shadow-md transition-all duration-300 hover:scale-[1.02]"
        >
          <div className="relative h-80">
            <Image
              src={player.image_url || '/placeholder.svg?height=400&width=300&text=Player'}
              alt={player.name}
              fill
              className="object-cover"
            />
            {player.jersey_number && (
              <div className="absolute right-0 top-0 -mr-2 flex h-12 w-12 skew-x-[-12deg] transform items-center justify-center bg-teal-800 text-2xl font-bold text-white">
                <span className="skew-x-[12deg] transform">{player.jersey_number}</span>
              </div>
            )}
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-teal-900">{player.name}</h3>
            <p className="mb-4 font-medium text-teal-700">{player.position || 'Team Member'}</p>
            <p className="text-sm text-zinc-600">{player.bio || 'No biography available.'}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
