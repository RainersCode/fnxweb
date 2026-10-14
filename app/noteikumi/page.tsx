import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { getActiveTraining, TrainingTimesList } from '@/components/features/training-times'
import { RUGBY_POSITIONS } from '@/lib/rugby-positions'

export const revalidate = 60

// Terms follow Latvian rugby usage (federation news, sportacentrs.com, Nacionālā enciklopēdija):
// grupu cīņa, auts, tvēriens, raks, mols, aizmugure, dropsitiens, soda piezemējums.

const scoring = [
  { points: 5, name: 'Piezemējums', text: 'Bumbu piezemē pretinieku ieskaites laukumā, piespiežot to pie zemes ar rokām vai ķermeni.' },
  { points: 2, name: 'Realizācija', text: 'Pēc piezemējuma sitiens pa vārtiem. To sit no līnijas, kas iet caur piezemējuma vietu, tāpēc izdevīgāk piezemēt tuvāk vārtiem.' },
  { points: 3, name: 'Soda sitiens', text: 'Pēc pretinieku pārkāpuma komanda var sist pa vārtiem no vietas, kur notika pārkāpums.' },
  { points: 3, name: 'Dropsitiens', text: 'Spēles laikā bumbu nomet zemē un iesit pa vārtiem brīdī, kad tā atlec.' },
  { points: 7, name: 'Soda piezemējums', text: 'Ja pretinieki ar pārkāpumu apturējuši gandrīz drošu piezemējumu, tiesnesis piešķir 7 punktus uzreiz, bez realizācijas.' },
]

const basics = [
  {
    name: 'Piespēle tikai atpakaļ',
    text: 'Ar rokām bumbu drīkst piespēlēt tikai atpakaļ vai uz sāniem. Uz priekšu to virza, skrienot ar bumbu vai sperot to ar kāju. Ja bumba no rokām izkrīt vai tiek piespēlēta uz priekšu, pretinieki saņem grupu cīņu.',
  },
  {
    name: 'Tvēriens',
    text: 'Aizsardzība aptur bumbas nesēju, satverot viņu zem plecu līnijas un nogāžot zemē. Tvert drīkst tikai spēlētāju ar bumbu. Nogāztajam bumba uzreiz jāatlaiž: jāpiespēlē vai jānoliek.',
  },
  {
    name: 'Raks',
    text: 'Kad bumba pēc tvēriena ir uz zemes un ap to uz kājām cīnās spēlētāji no abām komandām, veidojas raks. Rakā bumbu ar rokām ņemt nedrīkst, to izcīna, stumjot pretiniekus prom no bumbas.',
  },
  {
    name: 'Mols',
    text: 'Ja bumbas nesējs paliek uz kājām, pretinieks viņu tur un klāt piesaistās komandas biedrs, veidojas mols. Bumba ir rokās, un komanda kopā spiežas uz priekšu.',
  },
  {
    name: 'Grupu cīņa',
    text: 'Spēles atsākums pēc nelielām kļūdām, piemēram, piespēles uz priekšu. Astoņi uzbrucēji no katras komandas saķeras un spiežas viens pret otru, cīņas pussargs ieripina bumbu vidū, un komandas cīnās par to.',
  },
  {
    name: 'Auts',
    text: 'Kad bumba izlido pāri sānu līnijai, spēli atsāk ar autu. Spēlētāji nostājas divās rindās, hukers iemet bumbu taisni starp tām, un komandas cīnās par to, bieži paceļot savu lēcēju gaisā.',
  },
  {
    name: 'Aizmugure',
    text: 'Spēlētājs, kurš atrodas priekšā komandas biedram ar bumbu, ir aizmugurē un nedrīkst piedalīties spēlē, kamēr neatgriežas aiz bumbas. Rakā, molā un grupu cīņā jāstāv aiz pēdējā savas komandas spēlētāja.',
  },
]

// Formation, top = forwards. Percentages inside the diagram box.
const formation: Record<number, [number, number]> = {
  1: [37, 8], 2: [50, 8], 3: [63, 8],
  4: [43.5, 19], 5: [56.5, 19],
  6: [30, 21], 7: [70, 21], 8: [50, 30],
  9: [40, 41], 10: [29, 52],
  12: [41, 62], 13: [55, 70],
  11: [12, 78], 14: [88, 78],
  15: [50, 90],
}

const sectionPad = 'max-w-[1200px] mx-auto px-4 sm:px-6 md:px-16'
const eyebrow = 'font-cond text-[13px] font-bold tracking-[3px] uppercase text-club mb-3 block'
const h2 = 'font-display text-[clamp(34px,4.5vw,54px)] font-bold uppercase text-[#111] leading-[1.15] tracking-tight'

function Pitch() {
  // 100 m between the try lines = 840 units, so 8.4 units per metre
  const tryL = 80
  const tryR = 920
  const m = (metres: number) => metres * 8.4
  const line = 'stroke-white/80'
  return (
    <svg viewBox="0 0 1000 560" role="img" aria-label="Regbija laukuma shēma" className="w-full h-auto">
      <rect x="20" y="20" width="960" height="520" className="fill-club" />
      <rect x="20" y="20" width="60" height="520" className="fill-club-deep" />
      <rect x="920" y="20" width="60" height="520" className="fill-club-deep" />
      <rect x="20" y="20" width="960" height="520" fill="none" className={line} strokeWidth="3" />
      {[tryL, tryR].map((x) => <line key={x} x1={x} y1="20" x2={x} y2="540" className={line} strokeWidth="3" />)}
      {[tryL + m(22), tryR - m(22), 500].map((x) => <line key={x} x1={x} y1="20" x2={x} y2="540" className={line} strokeWidth="3" />)}
      {[500 - m(10), 500 + m(10), tryL + m(5), tryR - m(5)].map((x) => (
        <line key={x} x1={x} y1="20" x2={x} y2="540" className="stroke-white/40" strokeWidth="2" strokeDasharray="14 12" />
      ))}
      {/* Posts seen from above: two uprights joined by the crossbar */}
      {[tryL, tryR].map((x) => (
        <g key={`p${x}`}>
          <line x1={x} y1="256" x2={x} y2="304" className="stroke-club-mint" strokeWidth="7" />
          <circle cx={x} cy="256" r="8" className="fill-club-mint" />
          <circle cx={x} cy="304" r="8" className="fill-club-mint" />
        </g>
      ))}
      <g className="fill-white font-cond" fontSize="30" fontWeight="700" letterSpacing="2">
        <text x="50" y="280" textAnchor="middle" transform="rotate(-90 50 280)">IESKAITES LAUKUMS</text>
        <text x="950" y="280" textAnchor="middle" transform="rotate(90 950 280)">IESKAITES LAUKUMS</text>
        <text x={tryL + m(22)} y="66" textAnchor="middle" className="fill-white/90">22 m</text>
        <text x={tryR - m(22)} y="66" textAnchor="middle" className="fill-white/90">22 m</text>
        <text x="500" y="66" textAnchor="middle">VIDUS</text>
        <text x={tryL + 18} y="350" className="fill-club-mint">VĀRTI</text>
        <text x={tryR - 18} y="350" textAnchor="end" className="fill-club-mint">VĀRTI</text>
      </g>
    </svg>
  )
}

export default async function RulesPage() {
  const training = await getActiveTraining()
  const forwards = RUGBY_POSITIONS.filter((p) => p.group === 'uzbrucēji')
  const backs = RUGBY_POSITIONS.filter((p) => p.group === 'aizsargi')

  return (
    <MainLayout>
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-club-phoenix relative overflow-hidden">
          <div className={`${sectionPad} relative z-10 pt-24 pb-16 md:pt-32 md:pb-20`}>
            <span className="font-cond text-[13px] font-bold tracking-[3px] uppercase text-club-mint mb-3 block">
              Ceļvedis iesācējiem
            </span>
            <h1 className="pt-[0.08em] font-display text-[clamp(52px,8vw,104px)] font-bold uppercase text-white leading-[1.15] tracking-tight">
              Regbijs īsumā
            </h1>
            <p className="font-body text-base md:text-lg text-white/75 leading-relaxed mt-5 max-w-[560px]">
              Nekad neesi redzējis regbija spēli? Šeit ir pamati, lai saprastu, kas notiek laukumā, un lai droši
              nāktu uz pirmo treniņu.
            </p>
            <dl className="mt-10 grid gap-px bg-white/15 sm:grid-cols-3 max-w-[860px]">
              {[
                ['15', 'spēlētāju katrā komandā'],
                ['2 × 40', 'minūtes spēlē'],
                ['Atpakaļ', 'ar rokām bumbu piespēlē tikai atpakaļ'],
              ].map(([value, label]) => (
                <div key={label} className="bg-club-darker/60 px-5 py-4">
                  <dt className="font-display text-3xl md:text-4xl font-bold uppercase text-white leading-none">{value}</dt>
                  <dd className="font-body text-sm text-white/70 mt-1.5">{label}</dd>
                </div>
              ))}
            </dl>
            <p className="font-body text-sm text-white/55 mt-4 max-w-[560px]">
              Regbijā-7 laukumā ir 7 spēlētāji un puslaiki ir 7 minūtes, bet pamatnoteikumi ir tie paši.
            </p>
          </div>
        </section>

        {/* Pitch */}
        <section className="py-16 md:py-24 bg-white">
          <div className={`${sectionPad} grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:items-center`}>
            <div>
              <span className={eyebrow}>Laukums</span>
              <h2 className={h2}>Kur notiek spēle</h2>
              <p className="font-body text-[16px] text-[#444] leading-[1.75] mt-5">
                Laukums ir līdz 100 metriem garš un līdz 70 metriem plats. Abos galos ir ieskaites laukums: tur jāpiezemē bumba, lai gūtu punktus. Uz ieskaites
                laukuma līnijas stāv vārti: divi stabi ar pārliktni 3 metru augstumā. Sitienā bumbai jāpārlido pāri
                pārliktnim starp stabiem.
              </p>
              <p className="font-body text-[16px] text-[#444] leading-[1.75] mt-4">
                Spēli vada tiesnesis, un viņam palīdz divi asistenti pie sānu līnijām.
              </p>
            </div>
            <Pitch />
          </div>
        </section>

        {/* Scoring */}
        <section className="py-16 md:py-24 bg-club-pale">
          <div className={sectionPad}>
            <span className={eyebrow}>Punkti</span>
            <h2 className={`${h2} mb-10`}>Kā gūst punktus</h2>
            <ul className="divide-y divide-club/15 border-y border-club/15">
              {scoring.map((s) => (
                <li key={s.name} className="grid grid-cols-[64px_1fr] md:grid-cols-[96px_240px_1fr] gap-x-5 gap-y-1 py-6 items-baseline">
                  <span className="row-span-2 md:row-span-1 font-display text-5xl md:text-6xl font-bold text-club leading-none tabular-nums">
                    {s.points}
                  </span>
                  <h3 className="font-display text-xl md:text-2xl font-bold uppercase text-[#111] leading-tight">{s.name}</h3>
                  <p className="font-body text-[15px] text-[#444] leading-[1.7] max-w-[620px]">{s.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Basics */}
        <section className="py-16 md:py-24 bg-white">
          <div className={sectionPad}>
            <span className={eyebrow}>Pamatnoteikumi</span>
            <h2 className={`${h2} mb-10`}>Kas notiek laukumā</h2>
            <div className="grid gap-x-12 gap-y-10 md:grid-cols-2">
              {basics.map((b) => (
                <div key={b.name} className="border-t-2 border-club pt-5">
                  <h3 className="font-display text-xl md:text-2xl font-bold uppercase text-[#111] leading-tight mb-3">{b.name}</h3>
                  <p className="font-body text-[15px] text-[#444] leading-[1.75]">{b.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Positions */}
        <section className="py-16 md:py-24 bg-club-pale">
          <div className={sectionPad}>
            <span className={eyebrow}>Pozīcijas</span>
            <h2 className={`${h2} mb-4`}>Kas ir kas komandā</h2>
            <p className="font-body text-[16px] text-[#444] leading-[1.75] max-w-[620px] mb-10">
              Spēlētāji 1–8 ir uzbrucēji: viņi cīnās grupu cīņās, autos un rakos. Spēlētāji 9–15 ir aizsargi:
              ātrāki un veiklāki, viņi skrien, piespēlē un sit. Vietā, kur sākas spēle, komanda nostājas apmēram
              šādi.
            </p>
            <div className="grid gap-10 lg:grid-cols-[minmax(280px,420px)_1fr] lg:items-start">
              <div className="relative aspect-[4/5] w-full max-w-[420px] mx-auto bg-club rounded-sm overflow-hidden" role="img" aria-label="Spēlētāju izvietojums laukumā ar numuriem no 1 līdz 15">
                {Object.entries(formation).map(([n, [x, y]]) => (
                  <span
                    key={n}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 grid place-items-center h-10 w-10 md:h-11 md:w-11 rounded-full font-display text-lg font-bold ${Number(n) <= 8 ? 'bg-white text-club' : 'bg-club-mint text-club-darker'}`}
                    style={{ left: `${x}%`, top: `${y}%` }}
                  >
                    {n}
                  </span>
                ))}
              </div>
              <div className="grid gap-8 md:grid-cols-2">
                {[['Uzbrucēji', forwards, 'bg-white text-club'], ['Aizsargi', backs, 'bg-club-mint text-club-darker']].map(([title, list, chip]) => (
                  <div key={title as string}>
                    <h3 className="font-display text-2xl font-bold uppercase text-[#111] mb-4">{title as string}</h3>
                    <ul className="grid gap-4">
                      {(list as typeof RUGBY_POSITIONS).map((p) => (
                        <li key={p.name} className="flex gap-3">
                          <span className={`shrink-0 w-[52px] h-8 grid place-items-center rounded-full border border-club/20 font-display text-sm font-bold ${chip as string}`}>
                            {p.numbers.join(', ')}
                          </span>
                          <span>
                            <span className="block font-body font-semibold text-[#111]">{p.name}</span>
                            <span className="block font-body text-sm text-[#555] leading-relaxed">{p.role}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Penalties and cards */}
        <section className="py-16 md:py-24 bg-white">
          <div className={sectionPad}>
            <span className={eyebrow}>Sodi</span>
            <h2 className={`${h2} mb-10`}>Pārkāpumi un kartītes</h2>
            <div className="grid gap-x-12 gap-y-10 md:grid-cols-2">
              <div className="border-t-2 border-club pt-5">
                <h3 className="font-display text-xl md:text-2xl font-bold uppercase text-[#111] leading-tight mb-3">Soda sitiens</h3>
                <p className="font-body text-[15px] text-[#444] leading-[1.75] mb-3">
                  Par nopietnākiem pārkāpumiem, piemēram, bīstamu tvērienu, aizmuguri vai rokām rakā, pretinieki
                  saņem soda sitienu. Komanda izvēlas:
                </p>
                <ul className="font-body text-[15px] text-[#444] leading-[1.75] list-disc pl-5 space-y-1">
                  <li>sist pa vārtiem (3 punkti);</li>
                  <li>izsist bumbu autā, un auts būs viņu pašu;</li>
                  <li>ātri izspēlēt bumbu un turpināt uzbrukumu;</li>
                  <li>izvēlēties grupu cīņu.</li>
                </ul>
                <p className="font-body text-[15px] text-[#444] leading-[1.75] mt-3">
                  Par mazākiem pārkāpumiem sods ir vieglāks: var turpināt spēli vai izvēlēties grupu cīņu, bet sist
                  pa vārtiem nedrīkst.
                </p>
              </div>
              <div className="border-t-2 border-club pt-5">
                <h3 className="font-display text-xl md:text-2xl font-bold uppercase text-[#111] leading-tight mb-3">Spēle turpinās</h3>
                <p className="font-body text-[15px] text-[#444] leading-[1.75]">
                  Tiesnesis ne vienmēr svilpj uzreiz. Ja pēc pretinieku pārkāpuma komanda var turpināt izdevīgi,
                  spēle turpinās. Ja izdevība nerodas, tiesnesis atgriežas pie pārkāpuma un piešķir sodu.
                </p>
              </div>
              <div className="flex gap-4 border-t-2 border-club pt-5">
                <span className="mt-1 h-10 w-7 shrink-0 rounded-sm bg-[#F5C518]" aria-hidden="true" />
                <div>
                  <h3 className="font-display text-xl md:text-2xl font-bold uppercase text-[#111] leading-tight mb-3">Dzeltenā kartīte</h3>
                  <p className="font-body text-[15px] text-[#444] leading-[1.75]">
                    Spēlētājs uz 10 minūtēm pamet laukumu, un komanda tikmēr spēlē par vienu cilvēku mazāk.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 border-t-2 border-club pt-5">
                <span className="mt-1 h-10 w-7 shrink-0 rounded-sm bg-[#D92D20]" aria-hidden="true" />
                <div>
                  <h3 className="font-display text-xl md:text-2xl font-bold uppercase text-[#111] leading-tight mb-3">Sarkanā kartīte</h3>
                  <p className="font-body text-[15px] text-[#444] leading-[1.75]">
                    Par rupju vai bīstamu spēli spēlētāju noraida no laukuma līdz spēles beigām.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Video */}
        <section className="py-16 md:py-20 bg-club-pale">
          <div className={`${sectionPad} grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:items-center`}>
            <div>
              <span className={eyebrow}>Video</span>
              <h2 className={h2}>Noskaties, kā tas izskatās</h2>
              <p className="font-body text-[15px] text-[#444] leading-[1.75] mt-4">
                Īss video par regbija pamatiem (angļu valodā).
              </p>
            </div>
            <div className="relative aspect-video overflow-hidden bg-black">
              <iframe
                src="https://www.youtube-nocookie.com/embed/FOJejnPI0p0"
                title="Regbija pamati (angļu valodā)"
                loading="lazy"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </div>
        </section>

        {/* Join */}
        <section className="bg-club-phoenix relative overflow-hidden">
          <div className={`${sectionPad} relative z-10 py-16 md:py-24 grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-end`}>
            <div>
              <span className="font-cond text-[13px] font-bold tracking-[3px] uppercase text-club-mint mb-3 block">Nāc uz treniņu</span>
              <h2 className="font-display text-[clamp(38px,5vw,64px)] font-bold uppercase text-white leading-[1.15] tracking-tight">
                Labākais veids, kā saprast regbiju
              </h2>
              <p className="font-body text-base text-white/75 leading-relaxed mt-5 max-w-[480px]">
                Noteikumus visātrāk iemācīsies laukumā. Nāc uz treniņu: uzņemam jebkurā vecumā un ar jebkādu
                pieredzi.
              </p>
              <Link
                href="/contact"
                className="group mt-8 inline-flex w-full sm:w-auto justify-center items-center gap-2.5 bg-teal-700 hover:bg-teal-600 text-white px-8 py-4 font-cond text-[13px] font-bold tracking-[2.5px] uppercase transition-colors duration-200"
              >
                Sazinies ar mums
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
            {training.length > 0 && (
              <div className="lg:justify-self-end w-full max-w-[460px]">
                <TrainingTimesList sessions={training} tone="dark" />
              </div>
            )}
          </div>
        </section>
      </main>
    </MainLayout>
  )
}
