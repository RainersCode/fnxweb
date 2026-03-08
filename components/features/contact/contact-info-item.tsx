import { LucideIcon } from "lucide-react"

interface ContactInfoItemProps {
  icon: LucideIcon
  title: string
  children: React.ReactNode
}

export function ContactInfoItem({ icon: Icon, title, children }: ContactInfoItemProps) {
  return (
    <div className="flex items-start gap-4 p-5 bg-[#f5f5f5]">
      <div className="w-10 h-10 bg-[#111] text-white grid place-items-center flex-shrink-0">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-cond text-xs font-bold tracking-[2px] uppercase text-[#111] mb-1.5">{title}</h3>
        <div className="font-body text-sm text-[#666] leading-relaxed">{children}</div>
      </div>
    </div>
  )
}
