'use client'

import Image from 'next/image'
import Link from 'next/link'
import { MainLayout } from '@/components/layout/main-layout'

const scoringMethods = [
  {
    points: 5,
    name: 'Piezemējums',
    nameEn: 'Try',
    description:
      'Piezemējums tiek gūts, kad uzbrūkošās komandas spēlētājs pirmais piezemē bumbu pretinieku komandas ieskaites laukumā. Tas ir visaugstāk vērtētais punktu guvums spēlē.',
  },
  {
    points: 2,
    name: 'Realizācija',
    nameEn: 'Conversion',
    description:
      'Pēc piezemējuma komandai ir iespēja gūt papildu punktus ar sitienu pa vārtiem. Sitiens tiek veikts no vietas līnijā ar to vietu, kur tika izdarīts piezemējums.',
  },
  {
    points: 3,
    name: 'Soda sitiens',
    nameEn: 'Penalty Kick',
    description:
      'Kad pretinieki pārkāpj noteikumus, komandai tiek piešķirts soda sitiens. Ja bumba izlido pāri pārliktnim un starp stabiem, komanda saņem 3 punktus.',
  },
  {
    points: 3,
    name: 'Dropgols',
    nameEn: 'Drop Goal',
    description:
      'Spēlētājs var gūt vārtus atklātā spēles laikā — bumbu vispirms nomest zemē un tad sist pa to, kad tā atlec no zemes.',
  },
]

const gameElements = [
  {
    name: 'Satvēriens',
    nameEn: 'Tackle',
    description:
      'Satvēriens ir veids, kā aizsargājoša komanda aptur bumbas nesēju. Satvertais spēlētājs ar bumbu tiek nogāzts zemē. Pēc satvēriena bumbas nesējam nekavējoties jāatbrīvojas no bumbas.',
  },
  {
    name: 'Raks',
    nameEn: 'Ruck',
    description:
      'Raks ir spēles periods, kad viens vai vairāki spēlētāji no katras komandas atrodas uz kājām, fiziskā kontaktā, tuvu pie bumbas uz zemes. Spēlētāji rakā izmantojot kājas, mēģina iegūt vai saglabāt bumbu pārvaldījumā.',
  },
  {
    name: 'Mols',
    nameEn: 'Maul',
    description:
      'Mols veidojas, kad bumbas nesējs tiek satvers, bet paliek uz kājām, un vismaz viens spēlētājs no katras komandas pievienojas cīņai par bumbu. Atšķirībā no raka, molā bumba nav uz zemes.',
  },
  {
    name: 'Sadursme',
    nameEn: 'Scrum',
    description:
      'Sadursme ir spēles atsākums pēc dažiem pārkāpumiem. Astoņi spēlētāji no katras komandas pievienojas kopā noteiktā formācijā un spiežas viens pret otru. Bumbu iemet sadursmē spēlētājs ar numuru 9.',
  },
  {
    name: 'Iemetiens',
    nameEn: 'Lineout',
    description:
      'Kad bumba iziet ārpus laukuma malā, spēle tiek atsākta ar iemetienu. Spēlētāji no abām komandām nostājas divās rindās. Bumbas hokers iemet bumbu starp rindām, un spēlētāji cīnās par to — bieži ceļot komandas biedrus gaisā.',
  },
]

const forwards = [
  { num: '1', lv: 'Vaļējais stabs', en: 'Loosehead Prop' },
  { num: '2', lv: 'Hokers', en: 'Hooker' },
  { num: '3', lv: 'Slēgtais stabs', en: 'Tighthead Prop' },
  { num: '4, 5', lv: 'Otrās līnijas spēlētāji', en: 'Locks' },
  { num: '6', lv: 'Slēgtās puses flengers', en: 'Blindside Flanker' },
  { num: '7', lv: 'Atklātās puses flengers', en: 'Openside Flanker' },
  { num: '8', lv: 'Astotais numurs', en: 'Number 8' },
]

const backs = [
  { num: '9', lv: 'Sadursmes aizsargs', en: 'Scrum-half' },
  { num: '10', lv: 'Pusaizsargs', en: 'Fly-half' },
  { num: '11', lv: 'Kreisais spārns', en: 'Left Wing' },
  { num: '12', lv: 'Iekšējais centrs', en: 'Inside Centre' },
  { num: '13', lv: 'Ārējais centrs', en: 'Outside Centre' },
  { num: '14', lv: 'Labais spārns', en: 'Right Wing' },
  { num: '15', lv: 'Aizmugures aizsargs', en: 'Fullback' },
]

export default function RulesPage() {
  return (
    <MainLayout currentPage="RULES">
      <main className="flex-1">
        {/* ── HERO ── */}
        <section className="relative h-[420px] md:h-[520px] bg-[#111] bg-stripes-dark overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/AboutUs/parallax.jpg"
              alt="Noteikumi"
              fill
              className="object-cover opacity-20 scale-105 blur-[2px]"
              priority
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          </div>

          {/* Giant decorative number */}
          <div className="absolute -right-8 md:right-8 bottom-0 font-display text-[280px] md:text-[400px] font-bold text-white/[0.03] leading-none tracking-tighter select-none pointer-events-none">
            XV
          </div>

          <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16 h-full flex items-end pb-14">
            <div className="max-w-[700px]">
              <span className="font-cond text-[13px] font-bold tracking-[3px] uppercase text-teal-400 mb-3 block">
                RK Fēnikss — Ceļvedis
              </span>
              <h1 className="font-display text-[clamp(52px,7vw,96px)] font-bold uppercase text-white leading-[0.85] tracking-tight">
                Regbija<br />Noteikumi
              </h1>
              <p className="font-body text-[15px] text-white/50 leading-relaxed mt-5 max-w-[480px]">
                Viss, kas jāzina par regbiju — no punktu gūšanas līdz spēlētāju pozīcijām.
                Pilns ceļvedis iesācējiem un faniem.
              </p>
            </div>
          </div>
        </section>

        {/* ── STATS RIBBON ── */}
        <section className="bg-teal-700">
          <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4">
            {[
              { value: '15', label: 'Spēlētāji komandā' },
              { value: '80', label: 'Minūtes spēlē' },
              { value: '100m', label: 'Laukuma garums' },
              { value: '5', label: 'Punkti par piezemējumu' },
            ].map((stat) => (
              <div key={stat.label} className="px-6 py-5 md:py-6 border-r border-teal-600/50 last:border-r-0 text-center md:text-left">
                <span className="font-display text-3xl md:text-4xl font-bold text-white leading-none">
                  {stat.value}
                </span>
                <span className="block font-cond text-[11px] font-bold tracking-[2px] uppercase text-teal-200/70 mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── WHAT IS RUGBY — Editorial split ── */}
        <section className="bg-white">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid lg:grid-cols-[1fr_1.2fr] min-h-[400px]">
              {/* Text */}
              <div className="px-4 sm:px-6 md:px-16 py-16 md:py-20 flex flex-col justify-center">
                <span className="font-cond text-[13px] font-bold tracking-[3px] uppercase text-teal-700 mb-4 block">
                  01 — Ievads
                </span>
                <h2 className="font-display text-[clamp(36px,5vw,60px)] font-bold uppercase text-[#111] leading-[0.88] tracking-tight mb-6">
                  Kas Ir<br />Regbijs?
                </h2>
                <p className="font-body text-[16px] text-[#555] leading-[1.8] max-w-[520px]">
                  Regbijs ir kontakta komandu sporta spēle, kurā piedalās divas komandas ar
                  <strong className="text-[#111]"> 15 spēlētājiem</strong> katrā. Spēles mērķis ir gūt vairāk
                  punktus nekā pretinieki, ievērojot noteikumus un sportisko garu.
                </p>
                <p className="font-body text-[16px] text-[#555] leading-[1.8] mt-4 max-w-[520px]">
                  Spēle ilgst <strong className="text-[#111]">80 minūtes</strong> — divi puslaiki
                  pa 40 minūtēm ar pārtraukumu starp tiem.
                </p>
              </div>

              {/* Image / visual */}
              <div className="relative h-64 lg:h-auto bg-[#111] overflow-hidden">
                <Image
                  src="/AboutUs/parallax.jpg"
                  alt="Regbija spēle"
                  fill
                  className="object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
                {/* Overlaid field dimensions */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="font-display text-[80px] md:text-[120px] font-bold text-white/10 leading-none">
                      100×70
                    </div>
                    <span className="font-cond text-xs font-bold tracking-[3px] uppercase text-white/40">
                      Laukuma izmērs metros
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── PLAYING FIELD DETAIL ── */}
        <section className="py-12 bg-[#f5f5f5]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
            <div className="bg-white p-8 md:p-10 border-l-4 border-teal-700">
              <h3 className="font-display text-lg font-bold uppercase text-[#111] mb-3">Spēles laukums</h3>
              <p className="font-body text-[15px] text-[#555] leading-[1.8] max-w-3xl">
                Regbija laukums ir taisnstūra formas zāliens. Tā garums ir līdz <strong className="text-[#111]">100 metriem</strong>,
                bet platums — līdz <strong className="text-[#111]">70 metriem</strong>. Aiz katras mērķa līnijas atrodas ieskaites laukums
                (5 līdz 22 metri), kur var gūt piezemējumu. Laukuma galā atrodas vārti — divi vertikāli stabi
                ar horizontālu pārliktni.
              </p>
            </div>
          </div>
        </section>

        {/* ── VIDEO TUTORIAL ── */}
        <section className="py-16 md:py-24 bg-[#111] bg-stripes-dark relative overflow-hidden">
          {/* Decorative text */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-4 font-display text-[160px] md:text-[220px] font-bold text-white/[0.02] leading-none tracking-tighter select-none pointer-events-none -rotate-90 origin-left">
            PLAY
          </div>

          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16 relative z-10">
            <div className="grid lg:grid-cols-[340px_1fr] gap-10 lg:gap-16 items-center">
              {/* Left label */}
              <div>
                <span className="font-cond text-[13px] font-bold tracking-[3px] uppercase text-teal-400 mb-4 block">
                  02 — Video
                </span>
                <h2 className="font-display text-[clamp(36px,5vw,56px)] font-bold uppercase text-white leading-[0.88] tracking-tight mb-5">
                  Video<br />Pamācība
                </h2>
                <p className="font-body text-[15px] text-white/40 leading-relaxed">
                  Noskatieties īsu video, lai labāk izprastu regbija pamatus un galvenos noteikumus.
                </p>
              </div>

              {/* Video embed */}
              <div className="relative aspect-video overflow-hidden bg-black">
                <iframe
                  src="https://www.youtube.com/embed/FOJejnPI0p0"
                  title="Regbija noteikumi"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── SCORING — Magazine-style cards ── */}
        <section className="py-16 md:py-24 bg-white relative overflow-hidden">
          {/* Faint watermark */}
          <div className="absolute top-8 right-8 font-display text-[200px] md:text-[300px] font-bold text-[#f0f0f0] leading-none tracking-tighter select-none pointer-events-none">
            PTS
          </div>

          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16 relative z-10">
            <span className="font-cond text-[13px] font-bold tracking-[3px] uppercase text-teal-700 mb-4 block">
              03 — Punkti
            </span>
            <h2 className="font-display text-[clamp(36px,5vw,60px)] font-bold uppercase text-[#111] leading-[0.88] tracking-tight mb-14">
              Kā Gūst<br />Punktus?
            </h2>

            <div className="grid md:grid-cols-2 gap-0">
              {scoringMethods.map((method, i) => (
                <div
                  key={method.nameEn}
                  className={`group relative p-8 md:p-10 border border-[#e5e5e5] -mt-px -ml-px transition-colors duration-300 hover:bg-[#f9f9f9] ${
                    i === 0 ? 'md:border-r-0' : ''
                  }`}
                >
                  {/* Giant point number */}
                  <div className="absolute top-6 right-8 font-display text-[100px] md:text-[120px] font-bold text-[#f0f0f0] leading-none select-none pointer-events-none group-hover:text-teal-100 transition-colors duration-300">
                    {method.points}
                  </div>

                  <div className="relative z-10">
                    <span className="font-cond text-[11px] font-bold tracking-[2px] uppercase text-teal-700 block mb-2">
                      {method.points} {method.points === 1 ? 'Punkts' : 'Punkti'}
                    </span>
                    <h3 className="font-display text-2xl font-bold uppercase text-[#111] leading-tight mb-1">
                      {method.name}
                    </h3>
                    <span className="font-cond text-xs tracking-[1.5px] uppercase text-[#aaa] block mb-4">
                      {method.nameEn}
                    </span>
                    <p className="font-body text-[14px] text-[#666] leading-[1.7] max-w-[400px]">
                      {method.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BALL MOVEMENT ── */}
        <section className="py-16 md:py-20 bg-[#111] bg-stripes-dark relative overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
              <div>
                <span className="font-cond text-[13px] font-bold tracking-[3px] uppercase text-teal-400 mb-4 block">
                  04 — Bumbas kustība
                </span>
                <h2 className="font-display text-[clamp(36px,5vw,56px)] font-bold uppercase text-white leading-[0.88] tracking-tight mb-8">
                  Bumbas<br />Pārvietošana
                </h2>

                <div className="space-y-6">
                  {[
                    { action: 'Skrienot', detail: 'ar bumbu rokās' },
                    { action: 'Padodot', detail: 'bumbu komandas biedram — tikai atpakaļ vai sāniski, nevis uz priekšu' },
                    { action: 'Spiežot', detail: 'bumbu ar kāju — spert var jebkurā virzienā' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-5">
                      <span className="w-10 h-10 bg-teal-700 text-white font-display text-lg font-bold grid place-items-center flex-shrink-0">
                        {i + 1}
                      </span>
                      <div>
                        <span className="font-display text-lg font-bold uppercase text-white">{item.action}</span>
                        <p className="font-body text-[14px] text-white/50 leading-relaxed mt-0.5">{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Warning callout */}
              <div className="flex items-end">
                <div className="bg-white p-8 md:p-10 w-full">
                  <span className="font-cond text-[11px] font-bold tracking-[2px] uppercase text-red-600 block mb-3">
                    Svarīgi
                  </span>
                  <h3 className="font-display text-2xl font-bold uppercase text-[#111] leading-tight mb-4">
                    Knock-On
                  </h3>
                  <p className="font-body text-[15px] text-[#555] leading-[1.7]">
                    Ja bumba tiek padota vai nomesta uz priekšu, tas ir pārkāpums,
                    ko sauc par &quot;knock-on&quot; (bumba ārpus tuneļa).
                    Pretinieku komandai tiek piešķirta sadursme.
                  </p>
                  <div className="h-1 w-16 bg-red-500 mt-6" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── GAME ELEMENTS ── */}
        <section className="py-16 md:py-24 bg-white relative overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16 relative z-10">
            <span className="font-cond text-[13px] font-bold tracking-[3px] uppercase text-teal-700 mb-4 block">
              05 — Spēles elementi
            </span>
            <h2 className="font-display text-[clamp(36px,5vw,60px)] font-bold uppercase text-[#111] leading-[0.88] tracking-tight mb-14">
              Galvenie Spēles<br />Elementi
            </h2>

            {/* Staggered cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {gameElements.map((el, i) => (
                <div
                  key={el.nameEn}
                  className={`group bg-[#f5f5f5] p-7 md:p-8 hover:bg-[#111] transition-colors duration-400 ${
                    i === 4 ? 'lg:col-span-2' : ''
                  }`}
                >
                  <span className="font-cond text-[11px] font-bold tracking-[2px] uppercase text-teal-700 group-hover:text-teal-400 transition-colors block mb-2">
                    {el.nameEn}
                  </span>
                  <h3 className="font-display text-xl font-bold uppercase text-[#111] group-hover:text-white transition-colors leading-tight mb-4">
                    {el.name}
                  </h3>
                  <p className="font-body text-[14px] text-[#666] group-hover:text-white/60 transition-colors leading-[1.7]">
                    {el.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── OFFSIDE — Full-width callout ── */}
        <section className="bg-[#bce8e4]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16 py-14 md:py-16">
            <div className="grid lg:grid-cols-[auto_1fr] gap-8 lg:gap-16 items-center">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-[#111] grid place-items-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" className="w-8 h-8 md:w-10 md:h-10 text-teal-400 stroke-current fill-none" strokeWidth="2">
                    <line x1="12" y1="2" x2="12" y2="22" />
                    <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-display text-3xl md:text-4xl font-bold uppercase text-[#111] leading-tight">
                    Aizspēle
                  </h2>
                  <span className="font-cond text-xs font-bold tracking-[2px] uppercase text-teal-800/60">Offside</span>
                </div>
              </div>
              <p className="font-body text-[15px] text-[#444] leading-[1.8] max-w-2xl">
                Visi spēlētāji atklātā spēlē drīkst atrasties tikai aiz bumbas (tuvāk saviem vārtiem).
                Ja spēlētājs atrodas pretinieku pusē aiz bumbas, viņš ir aizspēlē un nedrīkst piedalīties spēlē,
                līdz atgriežas pareizā pozīcijā. Par aizspēles pārkāpumu tiek piešķirts sods.
              </p>
            </div>
          </div>
        </section>

        {/* ── PLAYER POSITIONS ── */}
        <section className="py-16 md:py-24 bg-[#111] bg-stripes-dark relative overflow-hidden">
          {/* Decorative */}
          <div className="absolute -right-10 top-1/2 -translate-y-1/2 font-display text-[300px] md:text-[500px] font-bold text-white/[0.02] leading-none tracking-tighter select-none pointer-events-none">
            1–15
          </div>

          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16 relative z-10">
            <span className="font-cond text-[13px] font-bold tracking-[3px] uppercase text-teal-400 mb-4 block">
              06 — Pozīcijas
            </span>
            <h2 className="font-display text-[clamp(36px,5vw,60px)] font-bold uppercase text-white leading-[0.88] tracking-tight mb-6">
              Spēlētāju<br />Pozīcijas
            </h2>
            <p className="font-body text-[15px] text-white/40 mb-14 max-w-xl">
              Regbija komandā ir 15 spēlētāji, kas sadalīti divās grupās.
              Komandai drīkst būt arī līdz astoņiem rezerves spēlētājiem.
            </p>

            <div className="grid md:grid-cols-2 gap-5">
              {/* Forwards */}
              <div className="bg-white/[0.06] border border-white/10 p-7 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-display text-2xl font-bold uppercase text-white">Uzbrucēji</h3>
                    <span className="font-cond text-xs font-bold tracking-[2px] uppercase text-teal-400">Forwards — 1 līdz 8</span>
                  </div>
                  <span className="font-display text-5xl font-bold text-white/10">F</span>
                </div>
                <div className="h-px bg-white/10 mb-5" />
                <ul className="space-y-3">
                  {forwards.map((p) => (
                    <li key={p.num} className="flex items-center gap-4">
                      <span className="w-8 h-8 bg-teal-700 text-white font-display text-sm font-bold grid place-items-center flex-shrink-0">
                        {p.num}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="font-body text-[14px] text-white/90 block">{p.lv}</span>
                        <span className="font-cond text-[11px] tracking-[1px] uppercase text-white/30">{p.en}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Backs */}
              <div className="bg-white/[0.06] border border-white/10 p-7 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-display text-2xl font-bold uppercase text-white">Aizsargi</h3>
                    <span className="font-cond text-xs font-bold tracking-[2px] uppercase text-teal-400">Backs — 9 līdz 15</span>
                  </div>
                  <span className="font-display text-5xl font-bold text-white/10">B</span>
                </div>
                <div className="h-px bg-white/10 mb-5" />
                <ul className="space-y-3">
                  {backs.map((p) => (
                    <li key={p.num} className="flex items-center gap-4">
                      <span className="w-8 h-8 bg-white/10 text-white font-display text-sm font-bold grid place-items-center flex-shrink-0">
                        {p.num}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="font-body text-[14px] text-white/90 block">{p.lv}</span>
                        <span className="font-cond text-[11px] tracking-[1px] uppercase text-white/30">{p.en}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── KICKOFF & PENALTIES — Side-by-side ── */}
        <section className="py-16 md:py-20 bg-[#f5f5f5]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
            <span className="font-cond text-[13px] font-bold tracking-[3px] uppercase text-teal-700 mb-4 block">
              07 — Noteikumi
            </span>
            <h2 className="font-display text-[clamp(36px,5vw,56px)] font-bold uppercase text-[#111] leading-[0.88] tracking-tight mb-14">
              Sākums, Sodi &<br />Priekšrocība
            </h2>

            <div className="grid md:grid-cols-2 gap-5 mb-5">
              {/* Kickoff */}
              <div className="bg-white p-8 border-t-4 border-teal-700">
                <h3 className="font-display text-xl font-bold uppercase text-[#111] mb-4">Sākuma sitiens</h3>
                <p className="font-body text-[14px] text-[#666] leading-[1.7]">
                  Spēle sākas ar sākuma sitienu no laukuma centra.
                  Sitieni no vārtiem tiek veikti arī pēc punktu gūšanas un katra puslaika sākumā.
                  Bumbai jāsasniedz vismaz 10 metru līnija.
                </p>
              </div>

              {/* Penalties */}
              <div className="bg-white p-8 border-t-4 border-[#111]">
                <h3 className="font-display text-xl font-bold uppercase text-[#111] mb-4">Sodi un pārkāpumi</h3>
                <p className="font-body text-[14px] text-[#666] leading-[1.7] mb-4">
                  Ja komanda pārkāpj noteikumus, pretiniekam tiek piešķirts:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-teal-700 rotate-45 mt-1.5 flex-shrink-0" />
                    <span className="font-body text-[14px] text-[#666]">
                      <strong className="text-[#111]">Soda sitiens</strong> — par nopietniem pārkāpumiem;
                      komanda var izvēlēties sist pa vārtiem, spert bumbu vai pieprasīt sadursmi
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-2 h-2 bg-teal-700 rotate-45 mt-1.5 flex-shrink-0" />
                    <span className="font-body text-[14px] text-[#666]">
                      <strong className="text-[#111]">Brīvsitiens</strong> — par mazāk nopietniem pārkāpumiem
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Advantage — full-width dark card */}
            <div className="bg-[#111] p-8 md:p-10 grid md:grid-cols-[auto_1fr] gap-6 md:gap-10 items-center">
              <div>
                <span className="font-cond text-[11px] font-bold tracking-[2px] uppercase text-teal-400 block mb-1">Noteikums</span>
                <h3 className="font-display text-2xl md:text-3xl font-bold uppercase text-white leading-tight">
                  Priekšrocība
                </h3>
                <span className="font-cond text-xs tracking-[1.5px] uppercase text-white/30">Advantage</span>
              </div>
              <p className="font-body text-[15px] text-white/60 leading-[1.7]">
                Ja komanda cieš no pretinieku pārkāpuma, bet saglabā labu pozīciju,
                tiesnesis var ļaut spēlei turpināties — piešķirot &quot;priekšrocību&quot;.
                Ja komanda zaudē pozīciju, tiesnesis atgriežas pie sākotnējā pārkāpuma vietas.
              </p>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="relative py-20 md:py-28 bg-[#111] bg-stripes-dark overflow-hidden">
          {/* Decorative */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="font-display text-[200px] md:text-[350px] font-bold text-white/[0.02] leading-none tracking-tighter">
              JOIN
            </span>
          </div>

          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16 text-center relative z-10">
            <span className="font-cond text-[13px] font-bold tracking-[3px] uppercase text-teal-400 mb-4 block">
              Pievienojies
            </span>
            <h2 className="font-display text-[clamp(40px,6vw,72px)] font-bold uppercase text-white leading-[0.85] tracking-tight mb-6">
              Gatavs<br />Izmēģināt?
            </h2>
            <p className="font-body text-[15px] text-white/40 leading-relaxed mb-10 max-w-xl mx-auto">
              Pievienojies RK &quot;Fēnikss&quot; un iemācies regbiju no pieredzējušiem treneriem.
              Mēs uzņemam spēlētājus jebkurā vecumā un prasmju līmenī!
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-12 py-4 bg-teal-700 text-white font-cond text-xs font-bold tracking-[2.5px] uppercase hover:bg-teal-600 transition-colors duration-200"
            >
              Sazinies Ar Mums
            </Link>
          </div>
        </section>
      </main>
    </MainLayout>
  )
}
