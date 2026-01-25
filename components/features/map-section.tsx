import { MapPin, Navigation, ExternalLink } from 'lucide-react'

interface MapSectionProps {
  title?: string
  titleHighlight?: string
  address: {
    name: string
    street: string
    city: string
    postcode: string
  }
}

export function MapSection({
  title = 'ATRODI',
  titleHighlight = 'MŪS',
  address,
}: MapSectionProps) {
  const fullAddress = `${address.street}, ${address.city}, ${address.postcode}, Latvia`

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`

  // Google Maps embed URL using search query for the actual address
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&t=&z=14&ie=UTF8&iwloc=&output=embed`

  return (
    <section className="relative py-20 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-200 to-transparent" />
      <div className="absolute top-16 right-0 w-48 h-0.5 bg-teal-700/20 skew-x-[-12deg]" />
      <div className="absolute top-20 right-0 w-32 h-0.5 bg-teal-700/10 skew-x-[-12deg]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-0.5 bg-teal-700 skew-x-[-12deg]" />
            <MapPin className="h-5 w-5 text-teal-600" />
            <div className="w-10 h-0.5 bg-teal-700 skew-x-[-12deg]" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tighter">
            <span className="text-teal-900">{title} </span>
            <span className="text-teal-600 italic font-light">{titleHighlight}</span>
          </h2>
          <p className="mt-4 text-zinc-600 max-w-md mx-auto">
            Apmeklējiet mūs un pievienojieties mūsu komandai
          </p>
          <div className="mx-auto mt-4 h-1 w-20 bg-teal-700 skew-x-[-12deg]" />
        </div>

        {/* Map Container */}
        <div className="relative overflow-hidden shadow-2xl">
          {/* Top accent */}
          <div className="h-1.5 bg-gradient-to-r from-teal-600 via-teal-500 to-teal-600" />

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

            {/* Address Card Overlay */}
            <div className="absolute bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-10">
              <div className="bg-white/95 backdrop-blur-md shadow-2xl overflow-hidden">
                {/* Card top accent */}
                <div className="h-1 bg-gradient-to-r from-teal-600 via-teal-500 to-teal-600" />

                <div className="p-5 sm:p-6">
                  {/* Location info */}
                  <div className="flex items-start gap-4 mb-5">
                    <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-gradient-to-br from-teal-600 to-teal-800 text-white transform skew-x-[-6deg] shadow-lg">
                      <MapPin className="h-5 w-5 transform skew-x-[6deg]" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-teal-900 mb-1 leading-tight">{address.name}</h3>
                      <p className="text-sm text-zinc-600 leading-relaxed">
                        {address.street}
                        <br />
                        {address.city}, {address.postcode}
                      </p>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex-1 inline-flex items-center justify-center gap-2 skew-x-[-12deg] transform bg-gradient-to-r from-teal-700 to-teal-800 px-4 py-2.5 font-bold tracking-wide text-white text-sm transition-all duration-300 hover:from-teal-600 hover:to-teal-700 shadow-lg hover:shadow-xl"
                    >
                      <span className="inline-flex skew-x-[12deg] transform items-center gap-2">
                        <Navigation className="h-4 w-4" />
                        NORĀDES
                      </span>
                    </a>
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center justify-center gap-2 skew-x-[-12deg] transform bg-white border-2 border-teal-700 px-4 py-2.5 font-bold tracking-wide text-teal-700 text-sm transition-all duration-300 hover:bg-teal-50 shadow-md"
                    >
                      <span className="inline-flex skew-x-[12deg] transform items-center gap-2">
                        <ExternalLink className="h-4 w-4" />
                        ATVĒRT
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom accent */}
          <div className="h-1 bg-gradient-to-r from-teal-600 via-teal-500 to-teal-600" />
        </div>
      </div>
    </section>
  )
}
