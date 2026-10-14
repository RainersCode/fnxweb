const DELAYS = [2000, 5000, 10000, 30000]

export function retryDelay(attempt: number): number {
  return DELAYS[Math.min(attempt, DELAYS.length - 1)]
}

export type LocalBackup<T> = { fields: T; at: number }

// Offer the device copy only when it is newer than the server row and actually different
export function shouldOfferRestore<T>(backup: LocalBackup<T> | null, serverUpdatedAt: string, server: T): boolean {
  if (!backup) return false
  if (backup.at <= Date.parse(serverUpdatedAt) + 1000) return false
  return JSON.stringify(backup.fields) !== JSON.stringify(server)
}
