import { Phone, Mail, Facebook, Instagram, ArrowUpRight } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { MapSection } from '@/components/features/map-section'
import { getActiveTraining, TrainingTimesSection } from '@/components/features/training-times'

export const revalidate = 60

const sectionPad = 'max-w-[1200px] mx-auto px-4 sm:px-6 md:px-16'
const cardLabel = 'font-cond text-[13px] font-bold tracking-[3px] uppercase text-club'

const socials = [
  { icon: Facebook, href: 'https://www.facebook.com/RKFenikss?locale=lv_LV', label: 'Facebook', handle: 'RKFenikss' },
  { icon: Instagram, href: 'https://www.instagram.com/rk_fenikss/', label: 'Instagram', handle: '@rk_fenikss' },
]

export default async function ContactPage() {
  const sessions = await getActiveTraining()

  return (
    <MainLayout>
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-club-phoenix relative overflow-hidden">
          <div className={`${sectionPad} relative z-10 pt-24 pb-14 md:pt-32 md:pb-20`}>
            <span className="font-cond text-[13px] font-bold tracking-[3px] uppercase text-club-mint mb-3 block">Kontakti</span>
            <h1 className="pt-[0.08em] font-display text-[clamp(48px,7.5vw,96px)] font-bold uppercase text-white leading-[1.15] tracking-tight">
              Sazinies ar mums
            </h1>
            <p className="font-body text-base md:text-lg text-white/75 leading-relaxed mt-5 max-w-[520px]">
              Zvani, raksti vai nāc uz treniņu. Atbildēsim uz jautājumiem par treniņiem, spēlēm un sadarbību.
            </p>
          </div>
        </section>

        {/* Ways to reach us */}
        <section className="bg-white py-14 md:py-20">
          <div className={`${sectionPad} grid gap-4 md:grid-cols-3`}>
            <a
              href="tel:+37129113938"
              className="group flex flex-col justify-between gap-8 border border-[#DCE3DF] p-6 md:p-8 transition-colors duration-200 hover:border-club hover:bg-club-pale"
            >
              <span className="flex items-center justify-between">
                <span className={cardLabel}>Zvani</span>
                <Phone className="h-6 w-6 text-club" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-display text-[clamp(26px,2.6vw,34px)] font-bold text-[#111] leading-tight tabular-nums">
                  +371 29113938
                </span>
                <span className="mt-2 block font-body text-sm text-[#555]">Pieskaries, lai zvanītu</span>
              </span>
            </a>

            <a
              href="mailto:rkfenikss@gmail.com"
              className="group flex flex-col justify-between gap-8 border border-[#DCE3DF] p-6 md:p-8 transition-colors duration-200 hover:border-club hover:bg-club-pale"
            >
              <span className="flex items-center justify-between">
                <span className={cardLabel}>Raksti</span>
                <Mail className="h-6 w-6 text-club" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-display text-[clamp(22px,2.2vw,30px)] font-bold text-[#111] leading-tight break-all">
                  rkfenikss@gmail.com
                </span>
                <span className="mt-2 block font-body text-sm text-[#555]">Atvērsies tavs e-pasts</span>
              </span>
            </a>

            <div className="flex flex-col justify-between gap-8 border border-[#DCE3DF] p-6 md:p-8">
              <span className={cardLabel}>Seko mums</span>
              <ul className="grid gap-2">
                {socials.map(({ icon: Icon, href, label, handle }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 py-1.5 text-[#111] hover:text-club"
                    >
                      <span className="grid h-10 w-10 shrink-0 place-items-center bg-club text-white transition-colors group-hover:bg-club-deep">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-body font-semibold">{label}</span>
                        <span className="block font-body text-sm text-[#555]">{handle}</span>
                      </span>
                      <ArrowUpRight className="ml-auto h-4 w-4 opacity-50 group-hover:opacity-100" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <MapSection
          address={{
            name: 'RK "Fēnikss"',
            street: 'Kaimiņi, Brenguļi',
            city: 'Brenguļu pagasts, Valmieras novads',
            postcode: 'LV-4245',
          }}
        />

        <TrainingTimesSection sessions={sessions} />

        {/* Legal details */}
        <section className="bg-white py-12 md:py-14 border-t border-[#DCE3DF]">
          <div className={sectionPad}>
            <h2 className="font-cond text-[13px] font-bold tracking-[3px] uppercase text-[#555] mb-5">Rekvizīti</h2>
            <dl className="grid gap-x-10 gap-y-4 font-body text-sm text-[#444] sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <dt className="text-[#777]">Nosaukums</dt>
                <dd className="mt-0.5 text-[#111]">Biedrība &quot;Regbija klubs &quot;Valmieras Fēnikss&quot;&quot;</dd>
              </div>
              <div>
                <dt className="text-[#777]">Juridiskā adrese</dt>
                <dd className="mt-0.5 text-[#111]">&quot;Lukstiņi&quot;, Bērzaines pagasts, Valmieras novads, LV-4208</dd>
              </div>
              <div>
                <dt className="text-[#777]">Reģistrācijas nr.</dt>
                <dd className="mt-0.5 text-[#111] tabular-nums">40008126600</dd>
              </div>
              <div>
                <dt className="text-[#777]">Banka</dt>
                <dd className="mt-0.5 text-[#111]">Swedbank, LV86HABA0551035059313</dd>
              </div>
            </dl>
          </div>
        </section>
      </main>
    </MainLayout>
  )
}
