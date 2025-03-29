import Image from 'next/image'
import { SectionContainer } from '@/components/features/section-container'
import { SectionTitle } from '@/components/features/section-title'

interface MapSectionProps {
  title?: string
  titleHighlight?: string
  address: {
    name: string
    street: string
    city: string
    postcode: string
  }
  mapImage?: string
}

export function MapSection({
  title = 'FIND',
  titleHighlight = 'US',
  address,
  mapImage = '/placeholder.svg?height=800&width=1600&text=Map',
}: MapSectionProps) {
  return (
    <SectionContainer withBackground>
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <SectionTitle title={title} titleHighlight={titleHighlight} align="center" />
      </div>

      <div className="overflow-hidden rounded-lg shadow-lg">
        <div className="relative h-[400px] w-full">
          <Image src={mapImage} alt="Map location" fill className="object-cover" priority />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="mx-4 max-w-md rounded-lg bg-white/95 p-6 shadow-lg backdrop-blur-sm">
              <h3 className="mb-2 text-xl font-bold text-teal-900">{address.name}</h3>
              <p className="mb-4 text-zinc-600">
                {address.street}
                <br />
                {address.city}, {address.postcode}
              </p>
              <button className="skew-x-[-12deg] transform bg-teal-800 px-6 py-3 font-medium tracking-wide text-white transition-all duration-300 hover:bg-teal-900">
                <span className="inline-flex skew-x-[12deg] transform items-center">
                  GET DIRECTIONS
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  )
}
