import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="flex h-64 w-full flex-col items-center justify-center gap-4">
      <Loader2 className="h-12 w-12 animate-spin text-club" />
      <p className="text-lg text-club">Loading team members...</p>
    </div>
  )
}
