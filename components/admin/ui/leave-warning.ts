// What to ask before leaving a form, or null when nothing would be lost
export function leaveWarning({ dirty, uploading = false }: { dirty: boolean; uploading?: boolean }): string | null {
  if (uploading) return 'Foto vēl augšupielādējas. Ja iziesi, pārējie netiks augšupielādēti. Iziet?'
  if (dirty) return 'Ir nesaglabātas izmaiņas. Iziet bez saglabāšanas?'
  return null
}
