import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="flex h-64 w-full flex-col items-center justify-center gap-4">
      <Loader2 className="h-12 w-12 animate-spin text-teal-700" />
      <p className="text-lg text-teal-900">Loading team members...</p>
    </div>
  )
}
