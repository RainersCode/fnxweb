import { describe, it, expect } from 'vitest'
import { leaveWarning } from './leave-warning'

describe('leaveWarning', () => {
  it('warns about running uploads first', () => {
    expect(leaveWarning({ dirty: true, uploading: true })).toBe('Foto vēl augšupielādējas. Ja iziesi, pārējie netiks augšupielādēti. Iziet?')
  })
  it('warns about unsaved changes', () => {
    expect(leaveWarning({ dirty: true })).toBe('Ir nesaglabātas izmaiņas. Iziet bez saglabāšanas?')
  })
  it('lets you leave when nothing is pending', () => {
    expect(leaveWarning({ dirty: false, uploading: false })).toBeNull()
  })
})
