import { Navigation, ExternalLink } from 'lucide-react'

interface MapSectionProps {
  title?: string
  address: {
    name: string
    street: string
    city: string
    postcode: string
  }
}

export function MapSection({
  address,
}: MapSectionProps) {
  const fullAddress = `${address.street}, ${address.city}, ${address.postcode}, Latvia`

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`

  // Google Maps embed URL using search query for the actual address
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&t=&z=14&ie=UTF8&iwloc=&output=embed`

  return (
    <section className="py-16 md:py-20 bg-[#f5f5f5]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
        <span className="font-cond text-[13px] font-bold tracking-[3px] uppercase text-teal-700 mb-3 block">Lokācija</span>
        <h2 className="font-display text-[clamp(32px,4vw,52px)] font-bold uppercase text-[#111] leading-[0.88] tracking-tight mb-10">
          Atrodi Mūs
        </h2>

        <div className="relative overflow-hidden">
          <div className="relative h-[450px] w-full bg-gray-100">
            {/* Google Maps Embed */}
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Kluba atrašanās vieta"
              className="absolute inset-0"
            />

            {/* Address overlay card */}
            <div className="absolute bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:max-w-md z-10">
              <div className="bg-white p-6">
                <h3 className="font-display text-lg font-bold uppercase text-[#111] mb-2">{address.name}</h3>
                <p className="font-body text-sm text-[#666] leading-relaxed mb-4">
                  {address.street}<br />{address.city}, {address.postcode}
                </p>
                <div className="flex gap-2">
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#111] text-white font-cond text-xs font-bold tracking-[2.5px] uppercase hover:bg-teal-700 transition-colors"
                  >
                    <Navigation className="h-4 w-4" />
                    Norādes
                  </a>
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 border-2 border-[#111] text-[#111] font-cond text-xs font-bold tracking-[2.5px] uppercase hover:bg-[#111] hover:text-white transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Atvērt
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
