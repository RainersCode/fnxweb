// Saves one value at a time; values pushed while a save runs collapse into the newest one
export function createLatestSaver<T>(save: (value: T) => Promise<void>) {
  let running: Promise<void> | null = null
  let pending: { value: T } | null = null

  const run = async () => {
    try {
      while (pending) {
        const { value } = pending
        pending = null
        await save(value)
      }
    } finally {
      pending = null
      running = null
    }
  }

  return function push(value: T): Promise<void> {
    pending = { value }
    if (!running) running = run()
    return running
  }
}
