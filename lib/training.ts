export const DAY_NAMES: Record<number, string> = {
  0: 'Svētdiena', 1: 'Pirmdiena', 2: 'Otrdiena', 3: 'Trešdiena', 4: 'Ceturtdiena', 5: 'Piektdiena', 6: 'Sestdiena',
}

// day_of_week follows JS (0 = Sunday); Latvian weeks start on Monday
export const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0]

export function formatTime(t: string): string {
  return t.slice(0, 5)
}

export function groupTrainingByDay<T extends { day_of_week: number; start_time: string }>(sessions: T[]) {
  return WEEK_ORDER.map((day) => ({
    day,
    label: DAY_NAMES[day],
    sessions: sessions
      .filter((s) => s.day_of_week === day)
      .sort((a, b) => formatTime(a.start_time).localeCompare(formatTime(b.start_time))),
  })).filter((g) => g.sessions.length > 0)
}
