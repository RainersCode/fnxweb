'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function CoachesList() {
  const [coaches, setCoaches] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Function to fetch coaches
    async function fetchCoaches() {
      try {
        setIsLoading(true)
        const supabase = createClient()
        const { data, error } = await supabase
          .from('coaches')
          .select('*')
          .eq('is_active', true)
          .order('name')
        
        if (error) throw error
        setCoaches(data || [])
        setError(null)
      } catch (err) {
        console.error('Error fetching coaches:', err)
        setError(err)
      } finally {
        setIsLoading(false)
      }
    }

    // Fetch data only once when component mounts
    fetchCoaches()
    
    // No interval refresh needed for static team data
  }, [])

  // Use minimal UI changes during loading to prevent layout shifts
  if (isLoading && coaches.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3 opacity-50">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-96 bg-gray-100 animate-pulse"></div>
        ))}
      </div>
    )
  }

  if (error) {
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
