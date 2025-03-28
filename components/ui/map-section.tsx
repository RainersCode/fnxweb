import Image from "next/image"
import { SectionContainer } from "@/components/ui/section-container"
import { SectionTitle } from "@/components/ui/section-title"

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
  title = "FIND",
  titleHighlight = "US",
  address,
  mapImage = "/placeholder.svg?height=800&width=1600&text=Map",
}: MapSectionProps) {
  return (
    <SectionContainer withBackground>
      <div className="max-w-2xl mx-auto text-center mb-12">
        <SectionTitle 
          title={title} 
          titleHighlight={titleHighlight} 
          align="center" 
        />
      </div>

      <div className="rounded-lg overflow-hidden shadow-lg">
        <div className="relative h-[400px] w-full">
          <Image 
            src={mapImage} 
            alt="Map location" 
            fill 
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/95 backdrop-blur-sm p-6 rounded-lg shadow-lg max-w-md mx-4">
              <h3 className="text-xl font-bold text-teal-900 mb-2">{address.name}</h3>
              <p className="text-zinc-600 mb-4">
                {address.street}
                <br />
                {address.city}, {address.postcode}
              </p>
              <button
                className="px-6 py-3 font-medium tracking-wide transform skew-x-[-12deg] transition-all duration-300 bg-teal-800 hover:bg-teal-900 text-white"
              >
                <span className="transform skew-x-[12deg] inline-flex items-center">GET DIRECTIONS</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  )
} 