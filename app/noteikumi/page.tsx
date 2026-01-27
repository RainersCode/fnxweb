'use client'

import { MainLayout } from '@/components/layout/main-layout'
import { ParallaxHeroSection } from '@/components/features/parallax-hero-section'
import {
  Target,
  Ruler,
  Trophy,
  MoveRight,
  Shield,
  Users,
  Flag,
  AlertTriangle,
  Play
} from 'lucide-react'

export default function RulesPage() {
  return (
    <MainLayout currentPage="RULES">
      <main className="flex-1">
        {/* Hero Section */}
        <ParallaxHeroSection
          title="REGBIJA"
          titleHighlight="NOTEIKUMI"
          subtitle="Viss, kas jāzina iesācējiem par regbiju - noteikumi, punktu gūšana, spēlētāju pozīcijas un galvenie spēles elementi."
          backgroundImage="/AboutUs/parallax.jpg"
        />

        {/* Introduction */}
        <section className="relative py-16 bg-white overflow-hidden">
          <div className="absolute top-16 left-0 w-48 h-0.5 bg-teal-700/20 skew-x-[-12deg]" />
          <div className="absolute top-20 left-0 w-32 h-0.5 bg-teal-700/10 skew-x-[-12deg]" />

          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-0.5 bg-teal-600 skew-x-[-12deg]" />
                <span className="text-teal-600 font-semibold tracking-wider text-sm">IEVADS</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-6">
                Kas ir <span className="text-teal-600">regbijs?</span>
              </h2>
              <p className="text-lg text-zinc-600 leading-relaxed">
                Regbijs ir kontakta komandu sporta spēle, kurā piedalās divas komandas ar 15 spēlētājiem katrā.
                Spēles mērķis ir gūt vairāk punktus nekā pretinieki, ievērojot noteikumus un sportisko garu.
                Spēle ilgst 80 minūtes — divi puslaiki pa 40 minūtēm ar pārtraukumu starp tiem.
              </p>
            </div>
          </div>
        </section>

        {/* Video Section */}
        <section className="relative py-16 bg-gradient-to-r from-teal-900 to-teal-700 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 via-teal-300 to-teal-400" />
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 via-teal-300 to-teal-400" />

          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-12 h-0.5 bg-teal-400 skew-x-[-12deg]" />
                  <span className="text-teal-300 font-semibold tracking-wider text-sm">VIDEO</span>
                  <div className="w-12 h-0.5 bg-teal-400 skew-x-[-12deg]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Regbija noteikumi video formātā
                </h2>
                <p className="text-teal-100">
                  Noskatieties īsu video, lai labāk izprastu regbija pamatus
                </p>
              </div>

              <div className="relative aspect-video bg-black shadow-2xl overflow-hidden">
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

        {/* Playing Field */}
        <section className="relative py-16 bg-zinc-50 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-teal-600 flex items-center justify-center skew-x-[-6deg]">
                  <Ruler className="h-7 w-7 text-white skew-x-[6deg]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-zinc-900">Spēles laukums</h2>
              </div>
              <div className="bg-white p-8 shadow-lg border-l-4 border-teal-600">
                <p className="text-zinc-600 leading-relaxed">
                  Regbija laukums ir taisnstūra formas zāliens. Tā garums ir līdz <strong>100 metriem</strong>,
                  bet platums — līdz <strong>70 metriem</strong>. Aiz katras mērķa līnijas atrodas ieskaites laukums
                  (5 līdz 22 metri), kur var gūt piezemējumu. Laukuma galā atrodas vārti — divi vertikāli stabi
                  ar horizontālu pārliktni.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Scoring */}
        <section className="relative py-16 bg-white overflow-hidden">
          <div className="absolute bottom-16 right-0 w-48 h-0.5 bg-teal-700/20 skew-x-[-12deg]" />

          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-teal-600 flex items-center justify-center skew-x-[-6deg]">
                  <Trophy className="h-7 w-7 text-white skew-x-[6deg]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-zinc-900">Kā gūst punktus?</h2>
              </div>

              <div className="grid gap-6">
                {/* Try */}
                <div className="bg-gradient-to-r from-teal-50 to-white p-6 border-l-4 border-teal-600 shadow-md">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-teal-600 text-white font-bold px-3 py-1 text-lg">5</span>
                    <h3 className="text-xl font-bold text-zinc-900">Piezemējums (Try)</h3>
                  </div>
                  <p className="text-zinc-600">
                    Piezemējums tiek gūts, kad uzbrūkošās komandas spēlētājs pirmais piezemē bumbu pretinieku
                    komandas ieskaites laukumā. Tas ir visaugstāk vērtētais punktu guvums spēlē.
                  </p>
                </div>

                {/* Conversion */}
                <div className="bg-gradient-to-r from-teal-50 to-white p-6 border-l-4 border-teal-500 shadow-md">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-teal-500 text-white font-bold px-3 py-1 text-lg">2</span>
                    <h3 className="text-xl font-bold text-zinc-900">Realizācijas sitiens (Conversion)</h3>
                  </div>
                  <p className="text-zinc-600">
                    Pēc piezemējuma komandai ir iespēja gūt papildu punktus ar sitienu pa vārtiem.
                    Sitiens tiek veikts no vietas līnijā ar to vietu, kur tika izdarīts piezemējums.
                    Bumbai jāizlido pāri pārliktnim un starp vārtu stabiem.
                  </p>
                </div>

                {/* Penalty */}
                <div className="bg-gradient-to-r from-teal-50 to-white p-6 border-l-4 border-teal-400 shadow-md">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-teal-400 text-white font-bold px-3 py-1 text-lg">3</span>
                    <h3 className="text-xl font-bold text-zinc-900">Soda sitiens (Penalty Kick)</h3>
                  </div>
                  <p className="text-zinc-600">
                    Kad pretinieki pārkāpj noteikumus, komandai tiek piešķirts soda sitiens.
                    Spēlētājs var izvēlēties sist pa vārtiem — ja bumba izlido pāri pārliktnim
                    un starp stabiem, komanda saņem 3 punktus.
                  </p>
                </div>

                {/* Drop Goal */}
                <div className="bg-gradient-to-r from-teal-50 to-white p-6 border-l-4 border-teal-300 shadow-md">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-teal-300 text-teal-900 font-bold px-3 py-1 text-lg">3</span>
                    <h3 className="text-xl font-bold text-zinc-900">Dropgols (Drop Goal)</h3>
                  </div>
                  <p className="text-zinc-600">
                    Spēlētājs var gūt vārtus arī atklātā spēles laikā, veicot sitienu pa vārtiem
                    no atlēciena — bumbu vispirms nomest zemē un tad sist pa to, kad tā atlec no zemes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ball Movement */}
        <section className="relative py-16 bg-zinc-50 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-teal-600 flex items-center justify-center skew-x-[-6deg]">
                  <MoveRight className="h-7 w-7 text-white skew-x-[6deg]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-zinc-900">Bumbas pārvietošana</h2>
              </div>

              <div className="bg-white p-8 shadow-lg">
                <p className="text-zinc-600 mb-6">Bumbu var pārvietot trīs veidos:</p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-teal-600 mt-2 skew-x-[-12deg]" />
                    <span className="text-zinc-700"><strong>Skrienot</strong> ar bumbu rokās</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-teal-600 mt-2 skew-x-[-12deg]" />
                    <span className="text-zinc-700"><strong>Padodot</strong> bumbu komandas biedram (padeves drīkst veikt tikai atpakaļ vai sāniski, nevis uz priekšu)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-teal-600 mt-2 skew-x-[-12deg]" />
                    <span className="text-zinc-700"><strong>Spiežot</strong> bumbu ar kāju (spert var jebkurā virzienā)</span>
                  </li>
                </ul>

                <div className="mt-6 p-4 bg-amber-50 border-l-4 border-amber-500">
                  <p className="text-amber-800 font-medium">
                    <strong>Svarīgi!</strong> Ja bumba tiek padota vai nomesta uz priekšu, tas ir pārkāpums,
                    ko sauc par "knock-on" (bumba ārpus tuneļa).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Game Elements */}
        <section className="relative py-16 bg-white overflow-hidden">
          <div className="absolute top-16 left-0 w-48 h-0.5 bg-teal-700/20 skew-x-[-12deg]" />

          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-teal-600 flex items-center justify-center skew-x-[-6deg]">
                  <Shield className="h-7 w-7 text-white skew-x-[6deg]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-zinc-900">Galvenie spēles elementi</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Tackle */}
                <div className="bg-zinc-50 p-6 border-t-4 border-teal-600">
                  <h3 className="text-xl font-bold text-zinc-900 mb-3">Satvēriens (Tackle)</h3>
                  <p className="text-zinc-600 text-sm">
                    Satvēriens ir veids, kā aizsargājoša komanda aptur bumbas nesēju.
                    Satvertais spēlētājs ar bumbu tiek nogāzts zemē.
                    Pēc satvēriena bumbas nesējam nekavējoties jāatbrīvojas no bumbas.
                  </p>
                </div>

                {/* Ruck */}
                <div className="bg-zinc-50 p-6 border-t-4 border-teal-500">
                  <h3 className="text-xl font-bold text-zinc-900 mb-3">Raks (Ruck)</h3>
                  <p className="text-zinc-600 text-sm">
                    Raks ir spēles periods, kad viens vai vairāki spēlētāji no katras komandas
                    atrodas uz kājām, fiziskā kontaktā, tuvu pie bumbas uz zemes.
                    Spēlētāji rakā izmantojot kājas, mēģina iegūt vai saglabāt bumbu pārvaldījumā.
                  </p>
                </div>

                {/* Maul */}
                <div className="bg-zinc-50 p-6 border-t-4 border-teal-400">
                  <h3 className="text-xl font-bold text-zinc-900 mb-3">Mols (Maul)</h3>
                  <p className="text-zinc-600 text-sm">
                    Mols veidojas, kad bumbas nesējs tiek satvers, bet paliek uz kājām,
                    un vismaz viens spēlētājs no katras komandas pievienojas cīņai par bumbu.
                    Atšķirībā no raka, molā bumba nav uz zemes.
                  </p>
                </div>

                {/* Scrum */}
                <div className="bg-zinc-50 p-6 border-t-4 border-teal-300">
                  <h3 className="text-xl font-bold text-zinc-900 mb-3">Sadursme (Scrum)</h3>
                  <p className="text-zinc-600 text-sm">
                    Sadursme ir spēles atsākums pēc dažiem pārkāpumiem.
                    Astoņi spēlētāji no katras komandas pievienojas kopā noteiktā formācijā un spiežas viens pret otru.
                    Bumbu iemet sadursmē spēlētājs ar numuru 9, un komandas cenšas izstumt bumbu sev.
                  </p>
                </div>

                {/* Lineout */}
                <div className="bg-zinc-50 p-6 border-t-4 border-teal-600 md:col-span-2">
                  <h3 className="text-xl font-bold text-zinc-900 mb-3">Iemetiens (Lineout)</h3>
                  <p className="text-zinc-600 text-sm">
                    Kad bumba iziet ārpus laukuma malā, spēle tiek atsākta ar iemetienu.
                    Spēlētāji no abām komandām nostājas divās rindās.
                    Bumbas hokers (spēlētājs ar numuru 2) iemet bumbu starp rindām,
                    un spēlētāji cīnās par to — bieži ceļot komandas biedrus gaisā.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Offside */}
        <section className="relative py-16 bg-zinc-50 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-amber-500 flex items-center justify-center skew-x-[-6deg]">
                  <AlertTriangle className="h-7 w-7 text-white skew-x-[6deg]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-zinc-900">Aizspēle (Offside)</h2>
              </div>

              <div className="bg-white p-8 shadow-lg border-l-4 border-amber-500">
                <p className="text-zinc-600 leading-relaxed">
                  Visi spēlētāji atklātā spēlē drīkst atrasties tikai aiz bumbas (tuvāk saviem vārtiem).
                  Ja spēlētājs atrodas pretinieku pusē aiz bumbas, viņš ir aizspēlē un nedrīkst piedalīties spēlē,
                  līdz atgriežas pareizā pozīcijā. Par aizspēles pārkāpumu tiek piešķirts sods.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Player Positions */}
        <section className="relative py-16 bg-white overflow-hidden">
          <div className="absolute bottom-16 right-0 w-48 h-0.5 bg-teal-700/20 skew-x-[-12deg]" />

          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-teal-600 flex items-center justify-center skew-x-[-6deg]">
                  <Users className="h-7 w-7 text-white skew-x-[6deg]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-zinc-900">Spēlētāju pozīcijas</h2>
              </div>

              <p className="text-zinc-600 mb-8">
                Regbija komandā ir 15 spēlētāji, kas sadalīti divās grupās:
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Forwards */}
                <div className="bg-teal-50 p-6 border-t-4 border-teal-600">
                  <h3 className="text-xl font-bold text-teal-800 mb-4">Uzbrucēji (1-8)</h3>
                  <p className="text-teal-700 text-sm mb-4">Spēlē sadursmē</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex gap-2"><span className="font-bold text-teal-600 w-6">1</span><span className="text-zinc-700">Vaļējais stabs (Loosehead Prop)</span></li>
                    <li className="flex gap-2"><span className="font-bold text-teal-600 w-6">2</span><span className="text-zinc-700">Hokers (Hooker)</span></li>
                    <li className="flex gap-2"><span className="font-bold text-teal-600 w-6">3</span><span className="text-zinc-700">Slēgtais stabs (Tighthead Prop)</span></li>
                    <li className="flex gap-2"><span className="font-bold text-teal-600 w-6">4, 5</span><span className="text-zinc-700">Otrās līnijas spēlētāji (Locks)</span></li>
                    <li className="flex gap-2"><span className="font-bold text-teal-600 w-6">6</span><span className="text-zinc-700">Slēgtās puses flengers (Blindside Flanker)</span></li>
                    <li className="flex gap-2"><span className="font-bold text-teal-600 w-6">7</span><span className="text-zinc-700">Atklātās puses flengers (Openside Flanker)</span></li>
                    <li className="flex gap-2"><span className="font-bold text-teal-600 w-6">8</span><span className="text-zinc-700">Astotais numurs (Number 8)</span></li>
                  </ul>
                </div>

                {/* Backs */}
                <div className="bg-zinc-100 p-6 border-t-4 border-zinc-600">
                  <h3 className="text-xl font-bold text-zinc-800 mb-4">Aizsargi (9-15)</h3>
                  <p className="text-zinc-600 text-sm mb-4">Ātri un tehniski spēlētāji</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex gap-2"><span className="font-bold text-zinc-600 w-6">9</span><span className="text-zinc-700">Sadursmes aizsargs (Scrum-half)</span></li>
                    <li className="flex gap-2"><span className="font-bold text-zinc-600 w-6">10</span><span className="text-zinc-700">Pusaizsargs (Fly-half)</span></li>
                    <li className="flex gap-2"><span className="font-bold text-zinc-600 w-6">11</span><span className="text-zinc-700">Kreisais spārns (Left Wing)</span></li>
                    <li className="flex gap-2"><span className="font-bold text-zinc-600 w-6">12</span><span className="text-zinc-700">Iekšējais centrs (Inside Centre)</span></li>
                    <li className="flex gap-2"><span className="font-bold text-zinc-600 w-6">13</span><span className="text-zinc-700">Ārējais centrs (Outside Centre)</span></li>
                    <li className="flex gap-2"><span className="font-bold text-zinc-600 w-6">14</span><span className="text-zinc-700">Labais spārns (Right Wing)</span></li>
                    <li className="flex gap-2"><span className="font-bold text-zinc-600 w-6">15</span><span className="text-zinc-700">Aizmugures aizsargs (Fullback)</span></li>
                  </ul>
                </div>
              </div>

              <p className="text-zinc-500 text-sm mt-6 text-center">
                Komandai drīkst būt arī līdz astoņiem rezerves spēlētājiem.
              </p>
            </div>
          </div>
        </section>

        {/* Kickoff & Penalties */}
        <section className="relative py-16 bg-zinc-50 overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Kickoff */}
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-teal-600 flex items-center justify-center skew-x-[-6deg]">
                      <Play className="h-6 w-6 text-white skew-x-[6deg]" />
                    </div>
                    <h2 className="text-xl font-bold text-zinc-900">Sākuma sitiens</h2>
                  </div>
                  <div className="bg-white p-6 shadow-md">
                    <p className="text-zinc-600 text-sm">
                      Spēle sākas ar sākuma sitienu no laukuma centra.
                      Sitieni no vārtiem tiek veikti arī pēc punktu gūšanas un katra puslaika sākumā.
                      Bumbai jāsasniedz vismaz 10 metru līnija.
                    </p>
                  </div>
                </div>

                {/* Penalties */}
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-amber-500 flex items-center justify-center skew-x-[-6deg]">
                      <Flag className="h-6 w-6 text-white skew-x-[6deg]" />
                    </div>
                    <h2 className="text-xl font-bold text-zinc-900">Sodi un pārkāpumi</h2>
                  </div>
                  <div className="bg-white p-6 shadow-md">
                    <p className="text-zinc-600 text-sm mb-4">
                      Ja komanda pārkāpj noteikumus, pretiniekam tiek piešķirts:
                    </p>
                    <ul className="space-y-3 text-sm">
                      <li className="text-zinc-700">
                        <strong>Soda sitiens</strong> — par nopietniem pārkāpumiem;
                        komanda var izvēlēties sist pa vārtiem, spert bumbu vai pieprasīt sadursmi
                      </li>
                      <li className="text-zinc-700">
                        <strong>Brīvsitiens</strong> — par mazāk nopietniem pārkāpumiem
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Advantage */}
              <div className="mt-8 bg-teal-600 p-6 text-white">
                <h3 className="text-xl font-bold mb-3">Priekšrocība (Advantage)</h3>
                <p className="text-teal-100">
                  Ja komanda cieš no pretinieku pārkāpuma, bet saglabā labu pozīciju,
                  tiesnesis var ļaut spēlei turpināties — piešķirot "priekšrocību".
                  Ja komanda zaudē pozīciju, tiesnesis atgriežas pie sākotnējā pārkāpuma vietas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-16 bg-gradient-to-r from-teal-900 to-teal-700 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 via-teal-300 to-teal-400" />

          <div className="container mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Gatavs izmēģināt regbiju?
            </h2>
            <p className="text-teal-100 mb-8 max-w-2xl mx-auto">
              Pievienojies RK "Fēnikss" un iemācies regbiju no pieredzējušiem treneriem.
              Mēs uzņemam spēlētājus jebkurā vecumā un prasmju līmenī!
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-teal-800 px-8 py-3 font-bold tracking-wide hover:bg-teal-50 transition-colors skew-x-[-6deg]"
            >
              <span className="skew-x-[6deg]">SAZINIES AR MUMS</span>
            </a>
          </div>
        </section>
      </main>
    </MainLayout>
  )
}
