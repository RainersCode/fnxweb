'use client'

import { Clock, MapPin, Users, Calendar } from 'lucide-react'
import { TrainingSession } from '@/types/supabase'
import Link from 'next/link'

interface HomeTrainingSectionProps {
  sessions: TrainingSession[]
}

const DAYS_OF_WEEK = [
  { value: 1, label: 'Pirmdiena', short: 'P' },
  { value: 2, label: 'Otrdiena', short: 'O' },
  { value: 3, label: 'Trešdiena', short: 'T' },
  { value: 4, label: 'Ceturtdiena', short: 'C' },
  { value: 5, label: 'Piektdiena', short: 'Pk' },
  { value: 6, label: 'Sestdiena', short: 'S' },
  { value: 0, label: 'Svētdiena', short: 'Sv' },
]

export function HomeTrainingSection({ sessions }: HomeTrainingSectionProps) {
  if (!sessions || sessions.length === 0) {
    return null
  }

  // Group sessions by day
  const sessionsByDay = DAYS_OF_WEEK.map(day => ({
    ...day,
    sessions: sessions.filter(s => s.day_of_week === day.value),
  })).filter(d => d.sessions.length > 0)

  return (
    <section className="relative py-20 bg-gradient-to-br from-teal-900 via-teal-800 to-teal-900 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 via-teal-300 to-teal-400" />
      <div className="absolute top-16 left-0 w-32 h-0.5 bg-teal-400/20 skew-x-[-12deg]" />
      <div className="absolute top-20 left-0 w-20 h-0.5 bg-teal-400/10 skew-x-[-12deg]" />
      <div className="absolute bottom-32 right-0 w-40 h-0.5 bg-teal-400/20 skew-x-[-12deg]" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-0.5 bg-teal-400 skew-x-[-12deg]" />
            <span className="text-teal-300 font-semibold tracking-wider text-sm uppercase">Grafiks</span>
            <div className="w-12 h-0.5 bg-teal-400 skew-x-[-12deg]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Treniņu <span className="text-teal-300">laiki</span>
          </h2>
          <p className="text-teal-100 max-w-2xl mx-auto">
            Pievienojies mūsu treniņiem! Gaidām tevi laukumā.
          </p>
        </div>

        {/* Training Schedule Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {sessionsByDay.map(({ label, short, sessions: daySessions }) => (
            <div
              key={label}
              className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 hover:border-teal-400/50 transition-all duration-300 hover:transform hover:scale-[1.02]"
            >
              {/* Day Header */}
              <div className="bg-teal-600/50 px-5 py-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">{label}</h3>
              </div>

              {/* Sessions */}
              <div className="p-5 space-y-4">
                {daySessions.map((session) => (
                  <div key={session.id} className="space-y-2">
                    {/* Time */}
                    <div className="flex items-center gap-2 text-teal-300">
                      <Clock className="h-4 w-4" />
                      <span className="font-semibold text-lg">
                        {session.start_time} - {session.end_time}
                      </span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-white/80">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm">{session.location}</span>
                    </div>

                    {/* Team Group */}
                    {session.team_group && session.team_group !== 'Visi' && (
                      <div className="flex items-center gap-2 text-white/70">
                        <Users className="h-4 w-4 flex-shrink-0" />
                        <span className="text-sm">{session.team_group}</span>
                      </div>
                    )}

                    {/* Description */}
                    {session.description && (
                      <p className="text-white/60 text-sm pl-6">{session.description}</p>
                    )}

                    {/* Separator if multiple sessions */}
                    {daySessions.length > 1 &&
                      session !== daySessions[daySessions.length - 1] && (
                        <div className="border-t border-white/10 pt-3 mt-3" />
                      )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-teal-800 px-8 py-3 font-bold tracking-wide hover:bg-teal-50 transition-colors skew-x-[-6deg] shadow-lg"
          >
            <span className="skew-x-[6deg]">PIESAKIES TRENIŅAM</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
