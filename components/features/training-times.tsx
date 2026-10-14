import { supabase } from '@/lib/supabase'
import { formatTime, groupTrainingByDay } from '@/lib/training'

export type PublicTraining = { id: string; day_of_week: number; start_time: string; end_time: string; location: string; team_group: string | null }

export async function getActiveTraining(): Promise<PublicTraining[]> {
  const { data, error } = await supabase
    .from('training_sessions')
    .select('id, day_of_week, start_time, end_time, location, team_group')
    .eq('is_active', true)
  if (error) {
    console.error('Error fetching training sessions:', error)
    return []
  }
  return (data ?? []) as PublicTraining[]
}

export function TrainingTimesList({ sessions, tone }: { sessions: PublicTraining[]; tone: 'light' | 'dark' }) {
  const groups = groupTrainingByDay(sessions)
  if (!groups.length) return null
  const muted = tone === 'dark' ? 'text-white/60' : 'text-[#666]'
  const time = tone === 'dark' ? 'text-club-mint' : 'text-club'
  const line = tone === 'dark' ? 'border-white/10' : 'border-[#e5e5e5]'
  return (
    <dl className="grid gap-3">
      {groups.map((g) => (
        <div key={g.day} className={`border-t ${line} pt-3`}>
          <dt className={`font-cond text-xs font-bold uppercase tracking-[2px] ${muted}`}>{g.label}</dt>
          {g.sessions.map((s) => (
            <dd key={s.id} className="mt-1 flex flex-wrap items-baseline gap-x-3">
              <span className={`font-display text-lg font-bold tabular-nums ${time}`}>{formatTime(s.start_time)}–{formatTime(s.end_time)}</span>
              <span className={`text-sm ${muted}`}>{[s.location, s.team_group].filter(Boolean).join(' · ')}</span>
            </dd>
          ))}
        </div>
      ))}
    </dl>
  )
}

export function TrainingTimesSection({ sessions }: { sessions: PublicTraining[] }) {
  if (!sessions.length) return null
  return (
    <section className="py-16 md:py-20 bg-club-pale">
      <div className="max-w-[1400px] mx-auto grid gap-8 px-4 sm:px-6 md:px-16 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <span className="font-cond text-[13px] font-bold tracking-[3px] uppercase text-club mb-3 block">Nāc uz treniņu</span>
          <h2 className="font-display text-[clamp(34px,4vw,56px)] font-bold uppercase text-club leading-[1.15] tracking-tight">Treniņu laiki</h2>
        </div>
        <TrainingTimesList sessions={sessions} tone="light" />
      </div>
    </section>
  )
}
