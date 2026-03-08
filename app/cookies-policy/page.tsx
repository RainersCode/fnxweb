import { Metadata } from 'next'
import { default as NextImage } from 'next/image'
import { MainLayout } from '@/components/layout/main-layout'

export const metadata: Metadata = {
  title: 'Sīkdatņu Politika | RK "Fēnikss"',
  description: 'RK "Fēnikss" sīkdatņu politika un izmantošanas principi',
}

function DiamondBullet() {
  return (
    <span className="inline-block w-[6px] h-[6px] bg-teal-500 rotate-45 mr-3 mt-[7px] shrink-0" />
  )
}

export default function CookiesPolicyPage() {
  return (
    <MainLayout currentPage="cookies-policy">
      <main className="flex-1">
        {/* Hero Banner */}
        <section className="relative h-[340px] md:h-[420px] bg-[#111] overflow-hidden">
          <div className="absolute inset-0">
            <NextImage src="/AboutUs/parallax.jpg" alt="Sīkdatņu politika" fill className="object-cover opacity-30 scale-105 blur-[2px]" priority />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16 h-full flex items-end pb-12">
            <div>
              <span className="font-cond text-[13px] font-bold tracking-[3px] uppercase text-teal-400 mb-3 block">RK Fēnikss</span>
              <h1 className="font-display text-[clamp(48px,6vw,86px)] font-bold uppercase text-white leading-[0.88] tracking-tight">
                Sīkdatņu<br />Politika
              </h1>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
            <div className="max-w-3xl">
              <h2 className="font-display text-xl font-bold uppercase text-[#111] tracking-tight mt-10 mb-4">Sīkdatņu veidi un izmantošanas mērķis</h2>
              <p className="font-body text-[15px] text-[#666] leading-relaxed mb-4">
                Lai palīdzētu analizēt interneta vietnes <strong className="text-[#111]">fnx-rugby.lv</strong> izmantošanu, t.sk., lai izprastu apmeklētāju darbības interneta vietnē <strong className="text-[#111]">fnx-rugby.lv</strong>, un tādējādi ļautu <strong className="text-[#111]">RK &quot;Fēnikss&quot;</strong> uzlabot un izveidotu lietotājiem ērtāku interneta vietni un uzlabotu tās darbību, <strong className="text-[#111]">RK &quot;Fēnikss&quot;</strong> izmanto interneta analīzes pakalpojumu, ko nodrošina Google Analytics rīks, un kura lietošanai ir nepieciešama Jūsu piekrišana.
              </p>
              <p className="font-body text-[15px] text-[#666] leading-relaxed mb-4">
                Sīkdatnēs tiek apkopota informācija par to, kā Jūs izmantojat interneta vietni <strong className="text-[#111]">fnx-rugby.lv</strong>. Šim nolūkam tiek apkopota standarta žurnāl ierakstu informācija (pieslēguma laiks, ilgums, IP adrese) un anonīma informācija par Jūsu darbībām interneta vietnē.
              </p>
              <p className="font-body text-[15px] text-[#666] leading-relaxed mb-4">
                Lai katrā vietnes apmeklējuma reizē nevajadzētu atkārtoti prasīt Jūsu piekrišanu, Jūsu ērtībai <strong className="text-[#111]">RK &quot;Fēnikss&quot;</strong> izmanto arī sīkdatnes, lai reģistrētu, vai Jūs esat piekritis (vai nē) tam, ka vietnē <strong className="text-[#111]">fnx-rugby.lv</strong> izmantojam sīkdatnes.
              </p>

              <h2 className="font-display text-xl font-bold uppercase text-[#111] tracking-tight mt-10 mb-4">Sīkdatņu datu izmantošana un uzglabāšana</h2>
              <p className="font-body text-[15px] text-[#666] leading-relaxed mb-4">
                Saskaņā ar Google Inc. pakalpojumu sniegšanas noteikumiem un Google Analytics pakalpojuma sniegšanas noteikumiem Google minēto informāciju izmantos, lai <strong className="text-[#111]">RK &quot;Fēnikss&quot;</strong> vajadzībām izvērtētu, kā Jūs lietojat interneta vietni, un lai sagatavotu pārskatus par lietotāju aktivitātēm vietnē.
              </p>
              <p className="font-body text-[15px] text-[#666] leading-relaxed mb-4">
                <strong className="text-[#111]">RK &quot;Fēnikss&quot;</strong> sīkdatnes neizmantos un to neļaus darīt nevienai trešajai personai nolūkā atrast vai vākt jebkādu identificējamu personas informāciju par interneta vietnes <strong className="text-[#111]">fnx-rugby.lv</strong> apmeklētājiem.
              </p>
              <p className="font-body text-[15px] text-[#666] leading-relaxed mb-4">
                Pēc <strong className="text-[#111]">RK &quot;Fēnikss&quot;</strong> pieprasījuma pirms saņemtās informācijas saglabāšanas Google Inc. to padarīs anonīmu, dzēšot jūsu IPv4 adreses pēdējo oktetu, un IPv6 adreses pēdējos 80 bitus atmiņā iestata uz nulli.
              </p>
              <p className="font-body text-[15px] text-[#666] leading-relaxed mb-4">
                Apkopotā informācija tiks nosūtīta un uzglabāta Google Inc. serveros, kas atrodas daudzās valstīs visā pasaulē. Informācija var tikt apstrādāta serverī, kas neatrodas Latvijā vai Eiropas Savienībā.
              </p>

              <h2 className="font-display text-xl font-bold uppercase text-[#111] tracking-tight mt-10 mb-4">Atteikšanās no sīkdatnēm</h2>
              <p className="font-body text-[15px] text-[#666] leading-relaxed mb-4">
                Jūs varat atteikties izmantot Google Analytics sīkdatnes, lejupielādējot un instalējot Google Analytics Opt-out Browser Add-on papildrīku. Šis papildrīks sazināsies ar Google Analytics JavaScript (ga.js), lai norādītu, ka informāciju par attiecīgo interneta vietnes apmeklējumu nedrīkst sūtīt uz Google Analytics.
              </p>
              <p className="font-body text-[15px] text-[#666] leading-relaxed mb-4">
                Tāpat Jūs varat mainīt pārlūkprogrammas iestatījumus, lai atteiktos no jaunām sīkdatnēm, izslēgtu esošās vai vienkārši informētu Jūs par jaunu sīkdatņu nosūtīšanu uz Jūsu ierīci. Vairāk lasiet <a href="http://www.allaboutcookies.org/" target="_blank" rel="noopener noreferrer" className="text-teal-700 hover:text-teal-600">http://www.allaboutcookies.org/</a>.
              </p>

              <h2 className="font-display text-xl font-bold uppercase text-[#111] tracking-tight mt-10 mb-4">Politikas grozījumi</h2>
              <p className="font-body text-[15px] text-[#666] leading-relaxed mb-4">
                <strong className="text-[#111]">RK &quot;Fēnikss&quot;</strong> sīkdatņu politika pēc nepieciešamības var tikt grozīta. Visas <strong className="text-[#111]">RK &quot;Fēnikss&quot;</strong> sīkdatņu politikas izmaiņas publicēs <strong className="text-[#111]">fnx-rugby.lv</strong> interneta vietnē, sniedzot īpašu paziņojumu par izmaiņām. Sīkdatņu politikas iepriekšējās versijas <strong className="text-[#111]">RK &quot;Fēnikss&quot;</strong> uzglabās arhīvā, lai Jūs nepieciešamības gadījumā varētu tās pārskatīt.
              </p>
            </div>
          </div>
        </section>
      </main>
    </MainLayout>
  )
}
