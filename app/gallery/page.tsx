import { Metadata } from 'next'
import { default as NextImage } from 'next/image'
import Link from 'next/link'
import { MainLayout } from '@/components/layout/main-layout'
import { Gallery } from '@/types/supabase'
import { Image as ImageIcon } from 'lucide-react'
import { supabase, prepareImagePath } from '@/lib/supabase'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Galerija | RK Fēnikss',
  description: 'RK Fēnikss regbija kluba foto galerijas - spēļu, treniņu un pasākumu fotogrāfijas.',
  openGraph: {
    title: 'Galerija | RK Fēnikss',
    description: 'RK Fēnikss regbija kluba foto galerijas - spēļu, treniņu un pasākumu fotogrāfijas.',
  },
}

interface GalleryWithThumbnail extends Gallery {
  thumbnailUrl: string | null
  imageCount?: number
}

function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }
  return new Date(dateString).toLocaleDateString('lv-LV', options)
}

async function getGalleries(): Promise<GalleryWithThumbnail[]> {
  try {
    const { data: galleriesData, error: galleriesError } = await supabase
      .from('galleries')
      .select('*')
      .order('created_at', { ascending: false })

    if (galleriesError) {
      console.error('Error fetching galleries:', galleriesError)
      throw galleriesError
    }

    const galleriesWithThumbnails = await Promise.all(
      (galleriesData || []).map(async (gallery) => {
        const { data: imagesData, error: imagesError } = await supabase
          .from('gallery_images')
          .select('*', { count: 'exact' })
          .eq('gallery_id', gallery.id)

        if (imagesError) {
          console.error(`Error fetching images for gallery ${gallery.id}:`, imagesError)
          return {
            ...gallery,
            thumbnailUrl: null,
            imageCount: 0,
          }
        }

        const thumbnailUrl =
          imagesData && imagesData.length > 0
            ? prepareImagePath(imagesData[0].image_url)
            : null

        return {
          ...gallery,
          thumbnailUrl,
          imageCount: imagesData?.length || 0,
        }
      })
    )

    return galleriesWithThumbnails
  } catch (error) {
    console.error('Error in gallery fetching process:', error)
    return []
  }
}

export default async function GalleryPage() {
  const galleries = await getGalleries()

  return (
    <MainLayout currentPage="GALLERY">
      <main className="flex-1">
        {/* Hero Banner */}
        <section className="relative h-[340px] md:h-[420px] bg-[#111] bg-stripes-dark overflow-hidden">
          <div className="absolute inset-0">
            <NextImage src="/AboutUs/parallax.jpg" alt="Galerija" fill className="object-cover opacity-30 scale-105 blur-[2px]" priority />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16 h-full flex items-end pb-12">
            <div>
              <span className="font-cond text-[13px] font-bold tracking-[3px] uppercase text-teal-400 mb-3 block">RK Fēnikss</span>
              <h1 className="font-display text-[clamp(48px,6vw,86px)] font-bold uppercase text-white leading-[0.88] tracking-tight">
                Kluba<br />Galerija
              </h1>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="bg-white py-16 md:py-20">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
            {/* Empty State */}
            {galleries.length === 0 && (
              <div className="py-16 text-center max-w-lg mx-auto">
                <div className="relative w-16 h-16 mx-auto mb-5 opacity-30">
                  <NextImage src="/Logo/fēniks_logo-removebg-preview.png" alt="Fēnikss" fill className="object-contain" />
                </div>
                <h3 className="font-display text-2xl font-bold uppercase text-[#111]/50 tracking-tight mb-2">Nav galeriju</h3>
                <p className="font-cond text-xs tracking-[2px] uppercase text-[#888]">Šobrīd nav publicētu galeriju</p>
              </div>
            )}

            {/* Featured Gallery + Grid */}
            {galleries.length > 0 && (
              <>
                {/* Featured Gallery */}
                <Link href={`/gallery/${galleries[0].id}`} className="group block mb-12">
                  <div className="grid md:grid-cols-[1fr_1.4fr] min-h-[440px]">
                    {/* Left text panel */}
                    <div className="bg-[#f5f5f5] p-10 md:p-12 flex flex-col justify-end order-2 md:order-1">
                      <h3 className="font-display text-[clamp(26px,3vw,38px)] font-bold uppercase leading-[0.98] text-[#111]">
                        {galleries[0].title}
                      </h3>
                      {galleries[0].description && (
                        <p className="font-body text-[15px] text-[#666] leading-relaxed mt-4 line-clamp-3">
                          {galleries[0].description}
                        </p>
                      )}
                      <div className="flex items-center gap-3.5 mt-6">
                        <span className="font-cond text-[13px] font-semibold tracking-[2px] uppercase text-[#888]">
                          {formatDate(galleries[0].created_at || new Date().toISOString())}
                        </span>
                        {galleries[0].imageCount !== undefined && galleries[0].imageCount > 0 && (
                          <span className="font-cond text-[13px] font-semibold tracking-[2px] uppercase text-[#888]">
                            {galleries[0].imageCount} foto
                          </span>
                        )}
                        <span className="w-[34px] h-[34px] border-2 border-[#111] grid place-items-center rotate-45 group-hover:bg-black/5 transition-colors">
                          <svg viewBox="0 0 24 24" className="w-3 h-3 fill-[#111] -rotate-45"><polygon points="8,5 19,12 8,19" /></svg>
                        </span>
                      </div>
                    </div>
                    {/* Right image */}
                    <div className="relative h-64 md:h-auto overflow-hidden order-1 md:order-2">
                      {galleries[0].thumbnailUrl ? (
                        <NextImage src={galleries[0].thumbnailUrl} alt={galleries[0].title} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[#e5e5e5]">
                          <ImageIcon className="h-20 w-20 text-[#ccc]" />
                        </div>
                      )}
                    </div>
                  </div>
                </Link>

                {/* Gallery Grid */}
                {galleries.length > 1 && (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {galleries.slice(1).map((gallery) => (
                      <Link
                        href={`/gallery/${gallery.id}`}
                        key={gallery.id}
                        className="group cursor-pointer transition-transform duration-300 hover:-translate-y-1"
                      >
                        <div className="h-[260px] overflow-hidden mb-3.5">
                          <div className="relative h-full">
                            {gallery.thumbnailUrl ? (
                              <NextImage src={gallery.thumbnailUrl} alt={gallery.title} fill className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-[#e5e5e5]">
                                <ImageIcon className="h-16 w-16 text-[#ccc]" />
                              </div>
                            )}
                          </div>
                        </div>
                        <h3 className="font-display text-xl font-bold uppercase leading-[1.05] text-[#111] tracking-wide">
                          {gallery.title}
                        </h3>
                        <div className="font-cond text-xs font-medium tracking-[1.5px] uppercase text-[#888] mt-2">
                          {formatDate(gallery.created_at || new Date().toISOString())}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
    </MainLayout>
  )
}
