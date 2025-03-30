import { Metadata } from 'next'
import { MainLayout } from '@/components/layout/main-layout'

export const metadata: Metadata = {
  title: 'Privātuma Politika | RK "Fēnikss"',
  description: 'RK "Fēnikss" privātuma politika un personas datu apstrādes principi',
}

export default function PrivacyPolicyPage() {
  return (
    <MainLayout currentPage="privacy-policy">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Privātuma Politika</h1>
        <div className="prose prose-zinc lg:prose-lg max-w-none">
          <p>
            Šī privātuma politika informē par privātuma praksi un personas datu apstrādes principiem saistībā ar biedrības regbija klubs &quot;FĒNIKSS&quot; mājas lapu un pakalpojumiem. Lai sazinātos saistībā ar datu apstrādes jautājumiem, lūdzu rakstiet e-pastu uz <a href="mailto:rkfenikss@gmail.com" className="text-teal-700 hover:underline">rkfenikss@gmail.com</a>.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Kādu informāciju mēs iegūstam?</h2>
          <p>
            Mēs iegūstam tādus personas datus, ko jūs mums brīvprātīgi sniedzat ar e-pasta starpniecību, aizpildot tīmeklī bāzētās anketas un citā tiešā saziņā ar jums.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Kā mēs izmantojam iegūtos personas datus?</h2>
          <p>Mēs varam izmantot iegūtos personas datus, lai</p>
          <ul className="list-disc pl-6 mb-6">
            <li>sniegtu jums jūsu pieprasītos pakalpojumus un informāciju,</li>
            <li>apstrādātu jūsu pasūtījumus un noformētu nepieciešamos dokumentus,</li>
            <li>sniegtu jums efektīvu klientu atbalstu,</li>
            <li>palīdzētu novērst apdraudējumu vai krāpnieciskas darbības,</li>
            <li>nosūtītu jums informatīvus ziņojumus, ja esat nepārprotami piekrituši tādus saņemt,</li>
            <li>ievērotu normatīvo aktu prasības,</li>
          </ul>
          <p>
            Mēs varam nodot jūsu informāciju trešajām personām, lai ievērotu normatīvo aktu prasības, sadarbotos ar uzraudzības iestādēm, palīdzētu novērstu noziedzīgas darbības un aizsargātu mūsu, jūsu un citu personu likumīgās tiesības.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Kā mēs aizsargājam personas datus?</h2>
          <p>
            Jūsu personas datu aizsardzībai mēs izmantojam dažādus tehniskus un organizatoriskus drošības pasākumus. Jūsu personas dati ir pieejami ierobežotam cilvēku skaitam, tikai pilnvarotām personām.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Cik ilgi mēs glabājam personas datus?</h2>
          <p>
            Mēs glabājam jūsu personas datus tik ilgi, cik ilgi tie ir mums nepieciešami atbilstoši to ieguves mērķim un kā to pieļauj vai nosaka normatīvo aktu prasības.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Kā mēs izmantojam sīkdatnes?</h2>
          <p>
            Sīkdatnes ir nelielas teksta datnes, ko jūsu apmeklētās mājas lapas saglabā jūsu datorā. Tās tiek izmantotas, lai nodrošinātu mājas lapas darbību, kā arī lai sniegtu informāciju vietnes īpašniekiem.
          </p>
          <p>Šī mājas lapa var iestatīt sekojošas sīkdatnes:</p>
          <ul className="list-disc pl-6 mb-6">
            <li><strong>Funkcionālās sīkdatnes.</strong> Šīs sīkdatnes ir nepieciešamas, lai jūs spētu pārvietoties mājas lapā un lietot tās funkcijas. Bez šim sīkdatnēm mēs nevaram nodrošināt jūsu pieprasītos pakalpojumus, piemēram, preču groza funkcionalitāti.</li>
            <li><strong>Google Analytics sīkdatnes.</strong> Šīs sīkdatnes lieto, lai iegūtu mūsu mājas lapas apmeklējuma statistiku. Mēs lietojam šo informāciju, lai uzlabotu vietnes darbību un reklāmas pasākumus.</li>
            <li><strong>Mērķētas reklāmas rīku sīkdatnes.</strong> Šīs sīkdatnes lieto, lai paaugstinātu reklāmas efektivitāti un rādītu reklāmas, kas, visticamāk, jūs interesēs visvairāk.</li>
            <li><strong>Trešās puses pakalpojumu sniedzēja sīkdatnes.</strong> Sīkdatnes var iestatīt šādi šajā mājas lapā lietotie trešo pušu pakalpojumi: Facebook poga "Patīk", YouTube video. Dažas no šīm sīkdatnēm var tikt izmantotas, lai sekotu līdzi jūsu darbībām citās mājas lapās, un mēs tās nevaram kontrolēt, jo šīs sīkdatnes nav iestatījusi mūsu mājas lapa.</li>
          </ul>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Kā atteikties no sīkdatnēm?</h2>
          <p>
            Lai atteiktos no sīkdatņu saņemšanas, jūs varat izmantojot privātās pārlūkošanas režīmu, kuru nodrošina lielākā daļa pārlūkprogrammu (privāts logs, inkognito logs vai InPrivate logs). Jebkādas sīkdatnes, kas tiek izveidotas, darbojoties privātās pārlūkošanas režīmā, tiek dzēstas, tiklīdz jūs aizverat visus pārlūka logus.
          </p>
          <p>
            Lai atteiktos no mērķētas reklāmas rādīšanai nepieciešamās informācijas iegūšanas un lietošanas, jūs varat izmantot bezmaksas rīku Your Online Choices vai YourAdChoices.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Jūsu tiesības saistībā ar jūsu personas datiem</h2>
          <p>
            Ja jūs esat datu subjekts saskaņā ar ES VDAR (piemēram, jūs esat ES pilsonis un sniedzat mums savus personas datus), jums ir turpmāk minētās tiesības saistībā ar saviem personas datiem:
          </p>
          <ul className="list-disc pl-6 mb-6">
            <li><strong>Tiesības piekļūt informācijai.</strong> Jums ir tiesības saņemt informāciju par to, kāpēc un kā tiek apstrādāti jūsu personas dati. Jums ir tiesības bez maksas saņemt mūsu rīcībā esošo jūsu personas datu kopiju plaši izmantotā elektroniskā formātā.</li>
            <li><strong>Tiesības labot.</strong> Jums ir tiesības panākt neprecīzu vai nepilnīgu personas datu labošanu vai papildināšanu bez nepamatotas kavēšanās.</li>
            <li><strong>Tiesības "tikt aizmirstam".</strong> Jums ir tiesības atsaukt savu piekrišanu personas datu apstrādei un panākt savu personas datu dzēšanu bez nepamatotas kavēšanās, tiklīdz dati vairs nav nepieciešami, lai sniegtu jūsu pieprasītos pakalpojumus un ievērotu normatīvo aktu prasības.</li>
            <li><strong>Tiesības ierobežot apstrādi.</strong> Jums ir tiesības panākt savu personas datu apstrādes ierobežošanu, ja jūs iebilstat pret to un mums nav leģitīmu pamatu turpināt apstrādi, ja jūs apstrīdat datu precizitāti, ja apstrāde ir pretlikumīga vai ja jūs pieprasāt celt, īstenot vai aizstāvēt likumīgas prasības.</li>
            <li><strong>Tiesības iebilst.</strong> Jums ir tiesības jebkurā brīdī iebilst pret datu apstrādi, ja vien tas nav nepieciešams sabiedrības interesēs veicamam uzdevumam vai apstrādei nepastāv neapstrīdami likumīgs pamats.</li>
            <li><strong>Citas tiesības saskaņā ar VDAR.</strong> Vairāk informācijas skatiet, apmeklējot ES datu aizsardzībai veltīto mājas lapu.</li>
          </ul>
        </div>
      </div>
    </MainLayout>
  )
} 