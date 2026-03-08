import { Metadata } from 'next'
import { default as NextImage } from 'next/image'
import { MainLayout } from '@/components/layout/main-layout'

export const metadata: Metadata = {
  title: 'Privātuma Politika | RK "Fēnikss"',
  description: 'RK "Fēnikss" privātuma politika un personas datu apstrādes principi',
}

function DiamondBullet() {
  return (
    <span className="inline-block w-[6px] h-[6px] bg-teal-500 rotate-45 mr-3 mt-[7px] shrink-0" />
  )
}

export default function PrivacyPolicyPage() {
  return (
    <MainLayout currentPage="privacy-policy">
      <main className="flex-1">
        {/* Hero Banner */}
        <section className="relative h-[340px] md:h-[420px] bg-[#111] overflow-hidden">
          <div className="absolute inset-0">
            <NextImage src="/AboutUs/parallax.jpg" alt="Privātuma politika" fill className="object-cover opacity-30 scale-105 blur-[2px]" priority />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
          <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16 h-full flex items-end pb-12">
            <div>
              <span className="font-cond text-[13px] font-bold tracking-[3px] uppercase text-teal-400 mb-3 block">RK Fēnikss</span>
              <h1 className="font-display text-[clamp(48px,6vw,86px)] font-bold uppercase text-white leading-[0.88] tracking-tight">
                Privātuma<br />Politika
              </h1>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-16">
            <div className="max-w-3xl">
              <p className="font-body text-[15px] text-[#666] leading-relaxed mb-4">
                Šī privātuma politika informē par privātuma praksi un personas datu apstrādes principiem saistībā ar biedrības regbija klubs &quot;FĒNIKSS&quot; mājas lapu un pakalpojumiem. Lai sazinātos saistībā ar datu apstrādes jautājumiem, lūdzu rakstiet e-pastu uz <a href="mailto:rkfenikss@gmail.com" className="text-teal-700 hover:text-teal-600">rkfenikss@gmail.com</a>.
              </p>

              <h2 className="font-display text-xl font-bold uppercase text-[#111] tracking-tight mt-10 mb-4">Kādu informāciju mēs iegūstam?</h2>
              <p className="font-body text-[15px] text-[#666] leading-relaxed mb-4">
                Mēs iegūstam tādus personas datus, ko jūs mums brīvprātīgi sniedzat ar e-pasta starpniecību, aizpildot tīmeklī bāzētās anketas un citā tiešā saziņā ar jums.
              </p>

              <h2 className="font-display text-xl font-bold uppercase text-[#111] tracking-tight mt-10 mb-4">Kā mēs izmantojam iegūtos personas datus?</h2>
              <p className="font-body text-[15px] text-[#666] leading-relaxed mb-4">Mēs varam izmantot iegūtos personas datus, lai</p>
              <ul className="mb-6 space-y-2">
                <li className="flex items-start font-body text-[15px] text-[#666] leading-relaxed">
                  <DiamondBullet />
                  <span>sniegtu jums jūsu pieprasītos pakalpojumus un informāciju,</span>
                </li>
                <li className="flex items-start font-body text-[15px] text-[#666] leading-relaxed">
                  <DiamondBullet />
                  <span>apstrādātu jūsu pasūtījumus un noformētu nepieciešamos dokumentus,</span>
                </li>
                <li className="flex items-start font-body text-[15px] text-[#666] leading-relaxed">
                  <DiamondBullet />
                  <span>sniegtu jums efektīvu klientu atbalstu,</span>
                </li>
                <li className="flex items-start font-body text-[15px] text-[#666] leading-relaxed">
                  <DiamondBullet />
                  <span>palīdzētu novērst apdraudējumu vai krāpnieciskas darbības,</span>
                </li>
                <li className="flex items-start font-body text-[15px] text-[#666] leading-relaxed">
                  <DiamondBullet />
                  <span>nosūtītu jums informatīvus ziņojumus, ja esat nepārprotami piekrituši tādus saņemt,</span>
                </li>
                <li className="flex items-start font-body text-[15px] text-[#666] leading-relaxed">
                  <DiamondBullet />
                  <span>ievērotu normatīvo aktu prasības,</span>
                </li>
              </ul>
              <p className="font-body text-[15px] text-[#666] leading-relaxed mb-4">
                Mēs varam nodot jūsu informāciju trešajām personām, lai ievērotu normatīvo aktu prasības, sadarbotos ar uzraudzības iestādēm, palīdzētu novērstu noziedzīgas darbības un aizsargātu mūsu, jūsu un citu personu likumīgās tiesības.
              </p>

              <h2 className="font-display text-xl font-bold uppercase text-[#111] tracking-tight mt-10 mb-4">Kā mēs aizsargājam personas datus?</h2>
              <p className="font-body text-[15px] text-[#666] leading-relaxed mb-4">
                Jūsu personas datu aizsardzībai mēs izmantojam dažādus tehniskus un organizatoriskus drošības pasākumus. Jūsu personas dati ir pieejami ierobežotam cilvēku skaitam, tikai pilnvarotām personām.
              </p>

              <h2 className="font-display text-xl font-bold uppercase text-[#111] tracking-tight mt-10 mb-4">Cik ilgi mēs glabājam personas datus?</h2>
              <p className="font-body text-[15px] text-[#666] leading-relaxed mb-4">
                Mēs glabājam jūsu personas datus tik ilgi, cik ilgi tie ir mums nepieciešami atbilstoši to ieguves mērķim un kā to pieļauj vai nosaka normatīvo aktu prasības.
              </p>

              <h2 className="font-display text-xl font-bold uppercase text-[#111] tracking-tight mt-10 mb-4">Kā mēs izmantojam sīkdatnes?</h2>
              <p className="font-body text-[15px] text-[#666] leading-relaxed mb-4">
                Sīkdatnes ir nelielas teksta datnes, ko jūsu apmeklētās mājas lapas saglabā jūsu datorā. Tās tiek izmantotas, lai nodrošinātu mājas lapas darbību, kā arī lai sniegtu informāciju vietnes īpašniekiem.
              </p>
              <p className="font-body text-[15px] text-[#666] leading-relaxed mb-4">Šī mājas lapa var iestatīt sekojošas sīkdatnes:</p>
              <ul className="mb-6 space-y-2">
                <li className="flex items-start font-body text-[15px] text-[#666] leading-relaxed">
                  <DiamondBullet />
                  <span><strong className="text-[#111]">Funkcionālās sīkdatnes.</strong> Šīs sīkdatnes ir nepieciešamas, lai jūs spētu pārvietoties mājas lapā un lietot tās funkcijas. Bez šim sīkdatnēm mēs nevaram nodrošināt jūsu pieprasītos pakalpojumus, piemēram, preču groza funkcionalitāti.</span>
                </li>
                <li className="flex items-start font-body text-[15px] text-[#666] leading-relaxed">
                  <DiamondBullet />
                  <span><strong className="text-[#111]">Google Analytics sīkdatnes.</strong> Šīs sīkdatnes lieto, lai iegūtu mūsu mājas lapas apmeklējuma statistiku. Mēs lietojam šo informāciju, lai uzlabotu vietnes darbību un reklāmas pasākumus.</span>
                </li>
                <li className="flex items-start font-body text-[15px] text-[#666] leading-relaxed">
                  <DiamondBullet />
                  <span><strong className="text-[#111]">Mērķētas reklāmas rīku sīkdatnes.</strong> Šīs sīkdatnes lieto, lai paaugstinātu reklāmas efektivitāti un rādītu reklāmas, kas, visticamāk, jūs interesēs visvairāk.</span>
                </li>
                <li className="flex items-start font-body text-[15px] text-[#666] leading-relaxed">
                  <DiamondBullet />
                  <span><strong className="text-[#111]">Trešās puses pakalpojumu sniedzēja sīkdatnes.</strong> Sīkdatnes var iestatīt šādi šajā mājas lapā lietotie trešo pušu pakalpojumi: Facebook poga &quot;Patīk&quot;, YouTube video. Dažas no šīm sīkdatnēm var tikt izmantotas, lai sekotu līdzi jūsu darbībām citās mājas lapās, un mēs tās nevaram kontrolēt, jo šīs sīkdatnes nav iestatījusi mūsu mājas lapa.</span>
                </li>
              </ul>

              <h2 className="font-display text-xl font-bold uppercase text-[#111] tracking-tight mt-10 mb-4">Kā atteikties no sīkdatnēm?</h2>
              <p className="font-body text-[15px] text-[#666] leading-relaxed mb-4">
                Lai atteiktos no sīkdatņu saņemšanas, jūs varat izmantojot privātās pārlūkošanas režīmu, kuru nodrošina lielākā daļa pārlūkprogrammu (privāts logs, inkognito logs vai InPrivate logs). Jebkādas sīkdatnes, kas tiek izveidotas, darbojoties privātās pārlūkošanas režīmā, tiek dzēstas, tiklīdz jūs aizverat visus pārlūka logus.
              </p>
              <p className="font-body text-[15px] text-[#666] leading-relaxed mb-4">
                Lai atteiktos no mērķētas reklāmas rādīšanai nepieciešamās informācijas iegūšanas un lietošanas, jūs varat izmantot bezmaksas rīku Your Online Choices vai YourAdChoices.
              </p>

              <h2 className="font-display text-xl font-bold uppercase text-[#111] tracking-tight mt-10 mb-4">Jūsu tiesības saistībā ar jūsu personas datiem</h2>
              <p className="font-body text-[15px] text-[#666] leading-relaxed mb-4">
                Ja jūs esat datu subjekts saskaņā ar ES VDAR (piemēram, jūs esat ES pilsonis un sniedzat mums savus personas datus), jums ir turpmāk minētās tiesības saistībā ar saviem personas datiem:
              </p>
              <ul className="mb-6 space-y-2">
                <li className="flex items-start font-body text-[15px] text-[#666] leading-relaxed">
                  <DiamondBullet />
                  <span><strong className="text-[#111]">Tiesības piekļūt informācijai.</strong> Jums ir tiesības saņemt informāciju par to, kāpēc un kā tiek apstrādāti jūsu personas dati. Jums ir tiesības bez maksas saņemt mūsu rīcībā esošo jūsu personas datu kopiju plaši izmantotā elektroniskā formātā.</span>
                </li>
                <li className="flex items-start font-body text-[15px] text-[#666] leading-relaxed">
                  <DiamondBullet />
                  <span><strong className="text-[#111]">Tiesības labot.</strong> Jums ir tiesības panākt neprecīzu vai nepilnīgu personas datu labošanu vai papildināšanu bez nepamatotas kavēšanās.</span>
                </li>
                <li className="flex items-start font-body text-[15px] text-[#666] leading-relaxed">
                  <DiamondBullet />
                  <span><strong className="text-[#111]">Tiesības &quot;tikt aizmirstam&quot;.</strong> Jums ir tiesības atsaukt savu piekrišanu personas datu apstrādei un panākt savu personas datu dzēšanu bez nepamatotas kavēšanās, tiklīdz dati vairs nav nepieciešami, lai sniegtu jūsu pieprasītos pakalpojumus un ievērotu normatīvo aktu prasības.</span>
                </li>
                <li className="flex items-start font-body text-[15px] text-[#666] leading-relaxed">
                  <DiamondBullet />
                  <span><strong className="text-[#111]">Tiesības ierobežot apstrādi.</strong> Jums ir tiesības panākt savu personas datu apstrādes ierobežošanu, ja jūs iebilstat pret to un mums nav leģitīmu pamatu turpināt apstrādi, ja jūs apstrīdat datu precizitāti, ja apstrāde ir pretlikumīga vai ja jūs pieprasāt celt, īstenot vai aizstāvēt likumīgas prasības.</span>
                </li>
                <li className="flex items-start font-body text-[15px] text-[#666] leading-relaxed">
                  <DiamondBullet />
                  <span><strong className="text-[#111]">Tiesības iebilst.</strong> Jums ir tiesības jebkurā brīdī iebilst pret datu apstrādi, ja vien tas nav nepieciešams sabiedrības interesēs veicamam uzdevumam vai apstrādei nepastāv neapstrīdami likumīgs pamats.</span>
                </li>
                <li className="flex items-start font-body text-[15px] text-[#666] leading-relaxed">
                  <DiamondBullet />
                  <span><strong className="text-[#111]">Citas tiesības saskaņā ar VDAR.</strong> Vairāk informācijas skatiet, apmeklējot ES datu aizsardzībai veltīto mājas lapu.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </MainLayout>
  )
}
