import { Metadata } from 'next'
import { MainLayout } from '@/components/layout/main-layout'

export const metadata: Metadata = {
  title: 'Sīkdatņu Politika | RK "Fēnikss"',
  description: 'RK "Fēnikss" sīkdatņu politika un izmantošanas principi',
}

export default function CookiesPolicyPage() {
  return (
    <MainLayout currentPage="cookies-policy">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Sīkdatņu Politika</h1>
        <div className="prose prose-zinc lg:prose-lg max-w-none">
          <h2 className="text-2xl font-semibold mt-8 mb-4">SĪKDATŅU VEIDI UN IZMANTOŠANAS MĒRĶIS</h2>
          <p>
            Lai palīdzētu analizēt interneta vietnes <strong>fnx-rugby.lv</strong> izmantošanu, t.sk., lai izprastu apmeklētāju darbības interneta vietnē <strong>fnx-rugby.lv</strong>, un tādējādi ļautu <strong>RK "Fēnikss"</strong> uzlabot un izveidotu lietotājiem ērtāku interneta vietni un uzlabotu tās darbību, <strong>RK "Fēnikss"</strong> izmanto interneta analīzes pakalpojumu, ko nodrošina Google Analytics rīks, un kura lietošanai ir nepieciešama Jūsu piekrišana.
          </p>
          <p>
            Sīkdatnēs tiek apkopota informācija par to, kā Jūs izmantojat interneta vietni <strong>fnx-rugby.lv</strong>. Šim nolūkam tiek apkopota standarta žurnāl ierakstu informācija (pieslēguma laiks, ilgums, IP adrese) un anonīma informācija par Jūsu darbībām interneta vietnē.
          </p>
          <p>
            Lai katrā vietnes apmeklējuma reizē nevajadzētu atkārtoti prasīt Jūsu piekrišanu, Jūsu ērtībai <strong>RK "Fēnikss"</strong> izmanto arī sīkdatnes, lai reģistrētu, vai Jūs esat piekritis (vai nē) tam, ka vietnē <strong>fnx-rugby.lv</strong> izmantojam sīkdatnes.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">SĪKDATŅU DATU IZMANTOŠANA UN UZGLABĀŠANA</h2>
          <p>
            Saskaņā ar Google Inc. pakalpojumu sniegšanas noteikumiem un Google Analytics pakalpojuma sniegšanas noteikumiem Google minēto informāciju izmantos, lai <strong>RK "Fēnikss"</strong> vajadzībām izvērtētu, kā Jūs lietojat interneta vietni, un lai sagatavotu pārskatus par lietotāju aktivitātēm vietnē.
          </p>
          <p>
            <strong>RK "Fēnikss"</strong> sīkdatnes neizmantos un to neļaus darīt nevienai trešajai personai nolūkā atrast vai vākt jebkādu identificējamu personas informāciju par interneta vietnes <strong>fnx-rugby.lv</strong> apmeklētājiem.
          </p>
          <p>
            Pēc <strong>RK "Fēnikss"</strong> pieprasījuma pirms saņemtās informācijas saglabāšanas Google Inc. to padarīs anonīmu, dzēšot jūsu IPv4 adreses pēdējo oktetu, un IPv6 adreses pēdējos 80 bitus atmiņā iestata uz nulli.
          </p>
          <p>
            Apkopotā informācija tiks nosūtīta un uzglabāta Google Inc. serveros, kas atrodas daudzās valstīs visā pasaulē. Informācija var tikt apstrādāta serverī, kas neatrodas Latvijā vai Eiropas Savienībā.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">ATTEIKŠANĀS NO SĪKDATNĒM</h2>
          <p>
            Jūs varat atteikties izmantot Google Analytics sīkdatnes, lejupielādējot un instalējot Google Analytics Opt-out Browser Add-on papildrīku. Šis papildrīks sazinās ar Google Analytics JavaScript (ga.js), lai norādītu, ka informāciju par attiecīgo interneta vietnes apmeklējumu nedrīkst sūtīt uz Google Analytics.
          </p>
          <p>
            Tāpat Jūs varat mainīt pārlūkprogrammas iestatījumus, lai atteiktos no jaunām sīkdatnēm, izslēgtu esošās vai vienkārši informētu Jūs par jaunu sīkdatņu nosūtīšanu uz Jūsu ierīci. Vairāk lasiet <a href="http://www.allaboutcookies.org/" target="_blank" rel="noopener noreferrer" className="text-teal-700 hover:underline">http://www.allaboutcookies.org/</a>.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">POLITIKAS GROZĪJUMI</h2>
          <p>
            <strong>RK "Fēnikss"</strong> sīkdatņu politika pēc nepieciešamības var tikt grozīta. Visas <strong>RK "Fēnikss"</strong> sīkdatņu politikas izmaiņas publicēs <strong>fnx-rugby.lv</strong> interneta vietnē, sniedzot īpašu paziņojumu par izmaiņām. Sīkdatņu politikas iepriekšējās versijas <strong>RK "Fēnikss"</strong> uzglabās arhīvā, lai Jūs nepieciešamības gadījumā varētu tās pārskatīt.
          </p>
        </div>
      </div>
    </MainLayout>
  )
} 