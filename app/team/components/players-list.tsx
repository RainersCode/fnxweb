'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function PlayersList() {
  const [players, setPlayers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Function to fetch players
    async function fetchPlayers() {
      try {
        setIsLoading(true)
        const supabase = createClient()
        const { data, error } = await supabase
          .from('team_players')
          .select('*')
          .eq('is_active', true)
          .order('jersey_number', { ascending: true })
          .order('name')
        
        if (error) throw error
        setPlayers(data || [])
        setError(null)
      } catch (err) {
        console.error('Error fetching players:', err)
        setError(err)
      } finally {
        setIsLoading(false)
      }
    }

    // Fetch data only once when component mounts
    fetchPlayers()
    
    // No interval refresh needed for static team data
  }, [])

  // Use minimal UI changes during loading to prevent layout shifts
  if (isLoading && players.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 opacity-50">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-96 bg-gray-100 animate-pulse"></div>
        ))}
      </div>
    )
  }

  if (error) {
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
