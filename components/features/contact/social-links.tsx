import { Facebook, Instagram, LucideIcon, Share2 } from "lucide-react"

interface SocialLink {
  icon: LucideIcon
  href: string
  label: string
  color: string
}

const defaultSocialLinks: SocialLink[] = [
  { icon: Facebook, href: "https://www.facebook.com/RKFenikss?locale=lv_LV", label: "Facebook", color: "hover:bg-[#1877F2]" },
  { icon: Instagram, href: "https://www.instagram.com/rk_fenikss/", label: "Instagram", color: "hover:bg-gradient-to-br hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888]" },
]

interface SocialLinksProps {
  links?: SocialLink[]
  title?: string
}

export function SocialLinks({ links = defaultSocialLinks, title = "SEKOJIET MUMS" }: SocialLinksProps) {
  return (
    <div className="relative bg-white p-5 shadow-md overflow-hidden">
      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-600 via-teal-500 to-teal-600" />

      <div className="flex items-center gap-3 mb-4">
        <Share2 className="h-5 w-5 text-teal-600" />
        {title && <h3 className="font-bold text-teal-900 tracking-wide text-sm uppercase">{title}</h3>}
      </div>

      <div className="flex gap-3">
        {links.map((link, index) => {
          const Icon = link.icon
          return (
            <a
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative h-12 w-12 flex items-center justify-center bg-teal-700 text-white transition-all duration-300 transform skew-x-[-6deg] shadow-md hover:shadow-lg hover:scale-110 ${link.color}`}
              aria-label={link.label}
            >
              <Icon className="h-5 w-5 transform skew-x-[6deg] transition-transform group-hover:scale-110" />
            </a>
          )
        })}
      </div>

      <p className="mt-4 text-xs text-zinc-500">
        Sekojiet mums sociālajos tīklos, lai būtu informēti par jaunumiem
      </p>
    </div>
  )
} 