const DELAYS = [2000, 5000, 10000, 30000]

export function retryDelay(attempt: number): number {
  return DELAYS[Math.min(attempt, DELAYS.length - 1)]
}

export type LocalBackup<T> = { fields: T; at: number }

// The device copy is removed only after the latest edits are saved, so any copy that still
// differs from the server is unsaved work. No clock comparison: device and server clocks differ,
// and a copy written right after a save is exactly the one worth keeping.
export function shouldOfferRestore<T>(backup: LocalBackup<T> | null, _serverUpdatedAt: string, server: T): boolean {
  if (!backup) return false
  return JSON.stringify(backup.fields) !== JSON.stringify(server)
}
