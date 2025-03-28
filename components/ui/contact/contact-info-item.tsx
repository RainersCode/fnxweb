import { LucideIcon } from "lucide-react"

interface ContactInfoItemProps {
  icon: LucideIcon
  title: string
  children: React.ReactNode
}

export function ContactInfoItem({ icon: Icon, title, children }: ContactInfoItemProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="h-10 w-10 flex items-center justify-center bg-teal-800 text-white transform rotate-45">
        <Icon className="h-5 w-5 transform -rotate-45" />
      </div>
      <div>
        <h3 className="font-semibold text-teal-900 tracking-wide">{title}</h3>
        <p className="text-zinc-600">{children}</p>
      </div>
    </div>
  )
} 