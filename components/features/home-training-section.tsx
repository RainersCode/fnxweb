'use client'

import { Clock, MapPin, Users } from 'lucide-react'
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
  if (!sessions || sessions.length === 0) return null

  const sessionsByDay = DAYS_OF_WEEK.map(day => ({
    ...day,
    sessions: sessions.filter(s => s.day_of_week === day.value),
  })).filter(d => d.sessions.length > 0)

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
        {/* Section header */}
        <div className="flex items-end justify-between mb-12">
          <h2 className="font-display text-[clamp(42px,5.5vw,80px)] font-bold uppercase text-teal-700 leading-[0.88] tracking-tight">
            Treniņu<br className="hidden sm:block" /> Laiki
          </h2>
          <Link href="/contact">
            <button className="hidden md:inline-flex items-center px-9 py-3.5 bg-[#111] text-white font-cond text-xs font-bold tracking-[2.5px] uppercase hover:bg-teal-700 transition-colors duration-200">
              Piesakies
            </button>
          </Link>
        </div>

        {/* Desktop: training cards in grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-5">
          {sessionsByDay.map(({ label, sessions: daySessions }) => (
            <div key={label} className="bg-[#f5f5f5] overflow-hidden">
              {/* Teal header */}
              <div className="bg-teal-700 px-6 py-4 flex items-center justify-between">
                <span className="font-display text-lg font-bold uppercase tracking-[2px] text-white">
                  {label}
                </span>
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              </div>
              {/* Body */}
              <div className="p-5">
                {daySessions.map((session, i) => (
                  <div key={session.id} className={`flex items-center gap-3 py-3 ${
                    i < daySessions.length - 1 ? 'border-b border-[#e5e5e5]' : ''
                  }`}>
                    <div className="flex flex-col gap-3 flex-1">
                      {/* Time */}
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-teal-700/[0.08] grid place-items-center flex-shrink-0">
                          <Clock className="h-4 w-4 text-teal-700" />
                        </div>
                        <div>
                          <div className="font-cond text-[10px] font-bold tracking-[2px] uppercase text-[#888]">
                            Laiks
                          </div>
                          <div className="font-semibold text-[15px]">
                            {session.start_time} - {session.end_time}
                          </div>
                        </div>
                      </div>
                      {/* Location */}
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-teal-700/[0.08] grid place-items-center flex-shrink-0">
                          <MapPin className="h-4 w-4 text-teal-700" />
                        </div>
                        <div>
                          <div className="font-cond text-[10px] font-bold tracking-[2px] uppercase text-[#888]">
                            Vieta
                          </div>
                          <div className="font-semibold text-[15px]">
                            {session.location}
                          </div>
                        </div>
                      </div>
                      {/* Team Group */}
                      {session.team_group && session.team_group !== 'Visi' && (
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-teal-700/[0.08] grid place-items-center flex-shrink-0">
                            <Users className="h-4 w-4 text-teal-700" />
                          </div>
                          <div>
                            <div className="font-cond text-[10px] font-bold tracking-[2px] uppercase text-[#888]">
                              Grupa
                            </div>
                            <div className="font-semibold text-[15px]">
                              {session.team_group}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: stacked list */}
        <div className="md:hidden space-y-0 divide-y divide-[#e5e5e5]">
          {sessionsByDay.map(({ label, sessions: daySessions }) => (
            <div key={label} className="py-5 first:pt-0 last:pb-0">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px w-4 bg-teal-700" />
                <h4 className="font-display text-base font-bold text-teal-700 uppercase tracking-wide">
                  {label}
                </h4>
                <div className="flex-1 h-px bg-[#e5e5e5]" />
                <span className="w-2 h-2 bg-green-500 rounded-full" />
              </div>
              <div className="space-y-3 pl-2">
                {daySessions.map((session, i) => (
                  <div key={session.id} className="space-y-1.5">
                    <div className="flex items-center gap-2 text-teal-700">
                      <Clock className="h-4 w-4" />
                      <span className="font-semibold">{session.start_time} - {session.end_time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#666]">
                      <MapPin className="h-4 w-4 flex-shrink-0 text-teal-700" />
                      <span className="text-sm">{session.location}</span>
                    </div>
                    {session.team_group && session.team_group !== 'Visi' && (
                      <div className="flex items-center gap-2 text-[#888]">
                        <Users className="h-4 w-4 flex-shrink-0 text-teal-700" />
                        <span className="text-sm">{session.team_group}</span>
                      </div>
                    )}
                    {i < daySessions.length - 1 && <div className="border-t border-[#f0f0f0] mt-3 pt-2" />}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="md:hidden mt-8 text-center">
          <Link href="/contact">
            <button className="inline-flex items-center px-9 py-3.5 bg-[#111] text-white font-cond text-xs font-bold tracking-[2.5px] uppercase hover:bg-teal-700 transition-colors duration-200">
              Piesakies treniņam
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
