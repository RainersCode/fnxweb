import { Navigation } from 'lucide-react'

interface MapSectionProps {
  address: {
    name: string
    street: string
    city: string
    postcode: string
  }
}

export function MapSection({ address }: MapSectionProps) {
  const fullAddress = `${address.street}, ${address.city}, ${address.postcode}, Latvia`
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&t=&z=13&ie=UTF8&iwloc=&output=embed`

  return (
    <section className="py-14 md:py-20 bg-club-pale">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-16 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] lg:items-stretch">
        <div className="flex flex-col">
          <span className="font-cond text-[13px] font-bold tracking-[3px] uppercase text-club mb-3 block">Kur mūs atrast</span>
          <h2 className="font-display text-[clamp(34px,4.5vw,54px)] font-bold uppercase text-[#111] leading-[1.15] tracking-tight">
            Atbrauc pie mums
          </h2>
          <address className="not-italic font-body text-[16px] text-[#444] leading-[1.75] mt-5">
            {address.name}
            <br />
            {address.street}
            <br />
            {address.city}, {address.postcode}
          </address>
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex w-full sm:w-auto self-start justify-center items-center gap-2.5 bg-teal-700 hover:bg-teal-600 text-white px-8 py-4 font-cond text-[13px] font-bold tracking-[2.5px] uppercase transition-colors duration-200"
          >
            <Navigation className="h-4 w-4" aria-hidden="true" />
            Rādīt ceļu
          </a>
        </div>
        <div className="relative h-[320px] md:h-[420px] w-full overflow-hidden bg-[#DCE3DF]">
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Kluba atrašanās vieta kartē"
            className="absolute inset-0"
          />
        </div>
      </div>
    </section>
  )
}
