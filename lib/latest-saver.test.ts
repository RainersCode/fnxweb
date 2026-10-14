import { describe, it, expect, vi } from 'vitest'
import { createLatestSaver } from './latest-saver'

function deferred() {
  let resolve!: () => void
  const promise = new Promise<void>((res) => { resolve = res })
  return { promise, resolve }
}

describe('createLatestSaver', () => {
  it('saves one at a time and skips orders overtaken while a save runs', async () => {
    const calls: string[] = []
    const gates: ReturnType<typeof deferred>[] = []
    const save = vi.fn((v: string) => { calls.push(v); const d = deferred(); gates.push(d); return d.promise })
    const push = createLatestSaver(save)
    const first = push('A')
    const second = push('B')
    const last = push('C')
    expect(calls).toEqual(['A'])
    gates[0].resolve()
    await vi.waitFor(() => expect(calls).toEqual(['A', 'C']))
    gates[1].resolve()
    await Promise.all([first, second, last])
    expect(save).toHaveBeenCalledTimes(2)
  })
  it('reports a failed save to the caller', async () => {
    const push = createLatestSaver(() => Promise.reject(new Error('Neizdevās')))
    await expect(push('A')).rejects.toThrow('Neizdevās')
  })
})
