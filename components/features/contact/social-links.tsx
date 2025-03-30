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
    <div>
      {title && <h3 className="text-xl font-bold text-teal-900 mt-12 mb-4">{title}</h3>}
      <div className="flex gap-4">
        {links.map((link, index) => {
          const Icon = link.icon
          return (
            <a
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 w-10 flex items-center justify-center bg-teal-800 text-white hover:bg-teal-700 transition-colors"
              aria-label={link.label}
            >
              <Icon className="h-5 w-5" />
            </a>
          )
        })}
      </div>
    </div>
  )
} 