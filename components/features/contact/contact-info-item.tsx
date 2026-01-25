import { LucideIcon } from "lucide-react"

interface ContactInfoItemProps {
  icon: LucideIcon
  title: string
  children: React.ReactNode
}

export function ContactInfoItem({ icon: Icon, title, children }: ContactInfoItemProps) {
  return (
    <div className="group relative bg-white p-5 shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden">
      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-600 via-teal-500 to-teal-600" />

      <div className="flex items-start gap-4">
        {/* Icon container */}
        <div className="flex-shrink-0 relative">
          <div className="h-12 w-12 flex items-center justify-center bg-gradient-to-br from-teal-600 to-teal-800 text-white transform skew-x-[-6deg] shadow-lg group-hover:scale-105 transition-transform duration-300">
            <Icon className="h-5 w-5 transform skew-x-[6deg]" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-teal-900 tracking-wide text-sm uppercase mb-1.5">{title}</h3>
          <div className="text-zinc-600 text-sm leading-relaxed">{children}</div>
        </div>
      </div>

      {/* Bottom accent on hover */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </div>
  )
} 