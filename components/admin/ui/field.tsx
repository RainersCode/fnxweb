import type { ReactNode } from 'react'

export const inputClass = 'w-full rounded-md border border-[#DCE3DF] bg-white px-3 py-2 text-[15px] focus:border-club focus:outline-none'

export function Field({ label, htmlFor, error, hint, children }: { label: string; htmlFor?: string; error?: string; hint?: string; children: ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={htmlFor} className="text-xs font-bold uppercase tracking-wide text-[#5B6863]">{label}</label>
      {children}
      {error ? <p className="text-sm text-[#B42318]">{error}</p> : hint ? <p className="text-xs text-[#5B6863]">{hint}</p> : null}
    </div>
  )
}
