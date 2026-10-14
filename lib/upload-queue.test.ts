import { describe, it, expect } from 'vitest'
import { naturalSortByName, pickNextToStart, queueSummary, retryFailed, type QueueItem } from './upload-queue'

const item = (id: string, status: QueueItem['status'], order = 0): QueueItem => ({ id, name: `${id}.jpg`, status, progress: 0, order })

describe('naturalSortByName', () => {
  it('orders photographer file names in shooting order', () => {
    const files = ['DSC_10.jpg', 'DSC_9.jpg', 'DSC_100.jpg', 'dsc_11.JPG', 'IMG_0002 (1).JPG', 'IMG_0002.JPG'].map((name) => ({ name }))
    expect(naturalSortByName(files).map((f) => f.name)).toEqual([
      'DSC_9.jpg', 'DSC_10.jpg', 'dsc_11.JPG', 'DSC_100.jpg', 'IMG_0002 (1).JPG', 'IMG_0002.JPG',
    ])
  })
  it('does not mutate the input', () => {
    const files = [{ name: 'b' }, { name: 'a' }]
    naturalSortByName(files)
    expect(files[0].name).toBe('b')
  })
})

describe('pickNextToStart', () => {
  it('starts waiting items up to the limit of 3, in queue order', () => {
    const items = [item('a', 'done', 1), item('b', 'waiting', 2), item('c', 'waiting', 3), item('d', 'waiting', 4), item('e', 'waiting', 5)]
    expect(pickNextToStart(items)).toEqual(['b', 'c', 'd'])
  })
  it('only fills free slots', () => {
    const items = [item('a', 'uploading', 1), item('b', 'uploading', 2), item('c', 'waiting', 3), item('d', 'waiting', 4)]
    expect(pickNextToStart(items)).toEqual(['c'])
  })
  it('never starts failed items by itself', () => {
    expect(pickNextToStart([item('a', 'failed', 1)])).toEqual([])
  })
})

describe('queueSummary and retryFailed', () => {
  it('counts each state', () => {
    const items = [item('a', 'done'), item('b', 'done'), item('c', 'failed'), item('d', 'uploading'), item('e', 'waiting')]
    expect(queueSummary(items)).toEqual({ total: 5, done: 2, failed: 1, active: 1, waiting: 1 })
  })
  it('retries only failed items, leaving finished ones untouched', () => {
    const items = [item('a', 'done'), { ...item('b', 'failed'), error: 'x', progress: 40 }, item('c', 'failed')]
    const next = retryFailed(items, ['b'])
    expect(next.map((i) => i.status)).toEqual(['done', 'waiting', 'failed'])
    expect(next[1]).toMatchObject({ progress: 0, error: undefined })
    expect(retryFailed(items).map((i) => i.status)).toEqual(['done', 'waiting', 'waiting'])
  })
})
