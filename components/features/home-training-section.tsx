'use client'

import { Clock, MapPin, Users, Calendar } from 'lucide-react'
import { TrainingSession } from '@/types/supabase'
import Link from 'next/link'

interface HomeTrainingSectionProps {
  sessions: TrainingSession[]
}

const DAYS_OF_WEEK = [
  { value: 1, label: 'Pirmdiena', short: 'Pr' },
  { value: 2, label: 'Otrdiena', short: 'Ot' },
  { value: 3, label: 'Trešdiena', short: 'Tr' },
  { value: 4, label: 'Ceturtdiena', short: 'Ce' },
  { value: 5, label: 'Piektdiena', short: 'Pk' },
  { value: 6, label: 'Sestdiena', short: 'Se' },
  { value: 0, label: 'Svētdiena', short: 'Sv' },
]

export function HomeTrainingSection({ sessions }: HomeTrainingSectionProps) {
  if (!sessions || sessions.length === 0) {
    return null
  }

  // Group sessions by day for mobile view
  const sessionsByDay = DAYS_OF_WEEK.map(day => ({
    ...day,
    sessions: sessions.filter(s => s.day_of_week === day.value),
  })).filter(d => d.sessions.length > 0)

  // For desktop calendar - all days including empty ones
  const allDaysSessions = DAYS_OF_WEEK.map(day => ({
    ...day,
    sessions: sessions.filter(s => s.day_of_week === day.value),
  }))

  return (
    <section className="relative py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-300 to-transparent" />
      <div className="absolute top-16 left-0 w-48 h-0.5 bg-teal-700/20 skew-x-[-12deg]" />
      <div className="absolute top-20 left-0 w-32 h-0.5 bg-teal-700/10 skew-x-[-12deg]" />
      <div className="absolute bottom-16 right-0 w-48 h-0.5 bg-teal-700/20 skew-x-[-12deg]" />
      <div className="absolute bottom-20 right-0 w-32 h-0.5 bg-teal-700/10 skew-x-[-12deg]" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-0.5 bg-teal-700 skew-x-[-12deg]" />
            <Clock className="h-5 w-5 text-teal-600" />
            <div className="w-10 h-0.5 bg-teal-700 skew-x-[-12deg]" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tighter">
            <span className="text-teal-900">TRENIŅU </span>
            <span className="text-teal-600 italic font-light">LAIKI</span>
          </h2>
          <p className="mt-4 text-zinc-600 max-w-md mx-auto">
            Pievienojies mūsu treniņiem! Gaidām tevi laukumā.
          </p>
          <div className="mx-auto mt-4 h-1 w-20 bg-teal-700 skew-x-[-12deg]" />
        </div>

        {/* Desktop Calendar View - Hidden on mobile/tablet */}
        <div className="hidden lg:block max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-xl">
            {/* Calendar Header - Days */}
            <div className="grid grid-cols-7 bg-teal-700">
              {DAYS_OF_WEEK.map((day) => (
                <div
                  key={day.value}
                  className="py-4 px-2 text-center border-r border-teal-600 last:border-r-0"
                >
                  <span className="text-white font-bold text-sm uppercase tracking-wide">
                    {day.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Calendar Body - Sessions */}
            <div className="grid grid-cols-7 min-h-[280px]">
              {allDaysSessions.map((day) => (
                <div
                  key={day.value}
                  className={`border-r border-gray-100 last:border-r-0 p-3 ${
                    day.sessions.length > 0 ? 'bg-teal-50/50' : 'bg-gray-50/50'
                  }`}
                >
                  {day.sessions.length > 0 ? (
                    <div className="space-y-3">
                      {day.sessions.map((session) => (
                        <div
                          key={session.id}
                          className="bg-white rounded-lg p-3 border border-teal-200 shadow-sm hover:shadow-md hover:border-teal-400 transition-all duration-300 hover:scale-[1.02] cursor-default"
                        >
                          {/* Time */}
                          <div className="flex items-center gap-1.5 text-teal-700 mb-2">
                            <Clock className="h-3.5 w-3.5" />
                            <span className="font-bold text-sm">
                              {session.start_time}
                            </span>
                            <span className="text-teal-400">-</span>
                            <span className="font-bold text-sm">
                              {session.end_time}
                            </span>
                          </div>

                          {/* Location */}
                          <div className="flex items-start gap-1.5 text-zinc-600 mb-1">
                            <MapPin className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-teal-600" />
                            <span className="text-xs leading-tight">{session.location}</span>
                          </div>

                          {/* Team Group */}
                          {session.team_group && session.team_group !== 'Visi' && (
                            <div className="flex items-center gap-1.5 text-zinc-500 mt-2">
                              <Users className="h-3.5 w-3.5 flex-shrink-0 text-teal-600" />
                              <span className="text-xs">{session.team_group}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <span className="text-gray-300 text-xs">—</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Card View - Hidden on desktop */}
        <div className="lg:hidden grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {sessionsByDay.map(({ label, sessions: daySessions }) => (
            <div
              key={label}
              className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {/* Day Header */}
              <div className="bg-teal-700 px-5 py-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white">{label}</h3>
              </div>

              {/* Sessions */}
              <div className="p-5 space-y-4">
                {daySessions.map((session, index) => (
                  <div key={session.id} className="space-y-2">
                    {/* Time */}
                    <div className="flex items-center gap-2 text-teal-700">
                      <Clock className="h-4 w-4" />
                      <span className="font-semibold text-lg">
                        {session.start_time} - {session.end_time}
                      </span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-zinc-600">
                      <MapPin className="h-4 w-4 flex-shrink-0 text-teal-600" />
                      <span className="text-sm">{session.location}</span>
                    </div>

                    {/* Team Group */}
                    {session.team_group && session.team_group !== 'Visi' && (
                      <div className="flex items-center gap-2 text-zinc-500">
                        <Users className="h-4 w-4 flex-shrink-0 text-teal-600" />
                        <span className="text-sm">{session.team_group}</span>
                      </div>
                    )}

                    {/* Description */}
                    {session.description && (
                      <p className="text-zinc-500 text-sm pl-6">{session.description}</p>
                    )}

                    {/* Separator if multiple sessions */}
                    {daySessions.length > 1 && index < daySessions.length - 1 && (
                      <div className="border-t border-gray-200 pt-3 mt-3" />
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
            className="inline-flex items-center gap-2 bg-teal-700 text-white px-8 py-3 font-bold tracking-wide hover:bg-teal-800 transition-colors skew-x-[-6deg] shadow-lg"
          >
            <span className="skew-x-[6deg]">PIESAKIES TRENIŅAM</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
