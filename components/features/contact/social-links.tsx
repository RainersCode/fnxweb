import { Facebook, Instagram, LucideIcon } from "lucide-react"

interface SocialLink {
  icon: LucideIcon
  href: string
  label: string
}

const defaultSocialLinks: SocialLink[] = [
  { icon: Facebook, href: "https://www.facebook.com/RKFenikss?locale=lv_LV", label: "Facebook" },
  { icon: Instagram, href: "https://www.instagram.com/rk_fenikss/", label: "Instagram" },
]

interface SocialLinksProps {
  links?: SocialLink[]
  title?: string
}

export function SocialLinks({ links = defaultSocialLinks, title = "SEKOJIET MUMS" }: SocialLinksProps) {
  return (
    <div className="p-5 bg-[#f5f5f5]">
      <h3 className="font-cond text-xs font-bold tracking-[2px] uppercase text-[#111] mb-4">{title}</h3>
      <div className="flex gap-3">
        {links.map((link, index) => {
          const Icon = link.icon
          return (
            <a
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-[#111] text-white grid place-items-center hover:bg-teal-700 transition-colors duration-200"
              aria-label={link.label}
            >
              <Icon className="h-4 w-4" />
            </a>
          )
        })}
      </div>
    </div>
  )
}
