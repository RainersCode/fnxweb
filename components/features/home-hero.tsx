import { default as NextImage } from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Fixture } from '@/types/supabase'

interface HomeHeroProps {
  nextFixture: Fixture | null
}

// Rendered on the server, so pin the timezone to the club's local time
const formatMatchDate = (dateString: string): string =>
  new Date(dateString).toLocaleDateString('lv-LV', {
    weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/Riga',
  })

const formatMatchTime = (dateString: string): string =>
  new Date(dateString).toLocaleTimeString('lv-LV', {
    hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Riga',
  })

export function HomeHero({ nextFixture }: HomeHeroProps) {
  return (
    <section className="relative flex flex-col min-h-[640px] h-[88vh] max-h-[880px] overflow-hidden bg-[#111]">
      {/* Background photo */}
      <NextImage
        src="/AboutUs/parallax.jpg"
        alt="RK Fēnikss spēlētāji pēc spēles"
        fill
        sizes="100vw"
        priority
        className="object-cover object-[70%_center]"
      />
      {/* Darken only the text side and the bottom edge, keep the players clear */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/0 md:via-black/40" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent" />

      {/* Main content */}
      <div className="relative z-10 flex-1 flex items-end w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16 pb-12 md:pb-16">
        <div className="w-full">
          <div className="max-w-[640px]">
            <h1>
              <span className="block font-cond text-[13px] font-bold tracking-[3px] uppercase text-club-mint">
                Valmieras regbija klubs
              </span>{' '}
              {/* Top padding leaves room for the macron on Ē */}
              <span className="block pt-[0.12em] font-display text-[clamp(72px,13vw,168px)] font-bold uppercase text-white leading-[0.85] tracking-tight">
                Fēnikss
              </span>
            </h1>
            <p className="font-body text-base md:text-lg text-white/75 leading-relaxed mt-6 max-w-[480px]">
              Regbijs Valmierā kopš 2005. gada. Startējam Latvijas čempionātā un starptautiskos
              turnīros gan regbijā XV, gan regbijā 7.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                href="/contact"
                className="group inline-flex w-full sm:w-auto justify-center items-center gap-2.5 bg-teal-700 hover:bg-teal-600 text-white px-8 py-4 font-cond text-[13px] font-bold tracking-[2.5px] uppercase transition-colors duration-200"
              >
                Pievienojies
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/fixtures"
                className="inline-flex w-full sm:w-auto justify-center items-center px-8 py-4 border-2 border-white/40 hover:border-white hover:bg-white/10 text-white font-cond text-[13px] font-bold tracking-[2.5px] uppercase transition-colors duration-200"
              >
                Spēļu kalendārs
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Next match bar */}
      {nextFixture && (
        <Link
          href="/fixtures"
          className="group relative z-10 block bg-club hover:bg-club-deep transition-colors duration-200"
        >
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16 py-5 flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
            <span className="font-cond text-xs font-bold tracking-[3px] uppercase text-club-mint shrink-0">
              Nākamā spēle
            </span>
            <span className="font-display text-2xl md:text-3xl font-bold uppercase text-white leading-[1.15] tracking-tight">
              {nextFixture.is_home_game
                ? <>Fēnikss <span className="text-club-mint">v</span> {nextFixture.opponent}</>
                : <>{nextFixture.opponent} <span className="text-club-mint">v</span> Fēnikss</>}
            </span>
            <span className="font-cond text-[13px] font-semibold tracking-[1.5px] uppercase text-white/70 md:ml-auto">
              {formatMatchDate(nextFixture.match_date)} · {formatMatchTime(nextFixture.match_date)}
              {' · '}
              {nextFixture.location || (nextFixture.is_home_game ? 'Mājas laukums' : 'Izbraukumā')}
            </span>
            <ArrowRight className="hidden md:block h-5 w-5 text-white shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </Link>
      )}
    </section>
  )
}
