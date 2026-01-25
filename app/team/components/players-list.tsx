'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from 'lucide-react'

export default function PlayersList() {
  const [players, setPlayers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
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

    fetchPlayers()
  }, [])

  if (isLoading && players.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white shadow-lg overflow-hidden">
            <div className="h-80 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
            <div className="p-6 space-y-3">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
              <div className="h-16 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 p-8 text-center">
        <p className="text-red-700 font-medium">Neizdevās ielādēt spēlētājus. Lūdzu, mēģiniet vēlreiz.</p>
      </div>
    )
  }

  if (!players || players.length === 0) {
    return (
      <div className="bg-teal-50 border border-teal-100 p-8 text-center">
        <User className="mx-auto h-12 w-12 text-teal-300 mb-3" />
        <p className="text-lg font-medium text-teal-800">Nav atrasti spēlētāji.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {players.map((player) => (
        <div
          key={player.id}
          className="group relative bg-white shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
        >
          {/* Image container */}
          <div className="relative h-80 overflow-hidden">
            <Image
              src={player.image_url || '/placeholder.svg?height=400&width=300&text=Player'}
              alt={player.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-teal-900/80 via-teal-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

            {/* Jersey number badge */}
            {player.jersey_number && (
              <div className="absolute top-4 right-0 z-10">
                <div className="skew-x-[-12deg] transform bg-teal-600 px-4 py-2 shadow-lg translate-x-1">
                  <span className="skew-x-[12deg] inline-block text-2xl font-extrabold text-white">
                    {player.jersey_number}
                  </span>
                </div>
              </div>
            )}

            {/* Name overlay on image */}
            <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
              <h3 className="text-xl font-bold text-white tracking-tight uppercase">
                {player.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-6 h-0.5 bg-teal-400 skew-x-[-12deg]" />
                <p className="text-sm font-semibold text-teal-300 uppercase tracking-wider">
                  {player.position || 'Komandas biedrs'}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <p className="text-sm text-zinc-600 leading-relaxed line-clamp-3">
              {player.bio || 'Biogrāfija nav pieejama.'}
            </p>
          </div>

          {/* Bottom accent bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-teal-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        </div>
      ))}
    </div>
  )
}
