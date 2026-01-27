import Link from 'next/link'
import {
  Newspaper,
  Calendar,
  Images,
  Users,
  UserCog,
  Phone,
  ArrowRight,
  LayoutDashboard,
  Home,
  Clock
} from 'lucide-react'

const adminSections = [
  {
    title: 'Raksti',
    description: 'Pārvaldīt kluba ziņas un rakstus',
    href: '/admin/articles',
    icon: Newspaper,
    color: 'from-blue-500 to-blue-600',
    bgLight: 'bg-blue-50',
    textColor: 'text-blue-600'
  },
  {
    title: 'Spēles',
    description: 'Atjaunot spēļu grafikus un rezultātus',
    href: '/admin/fixtures',
    icon: Calendar,
    color: 'from-emerald-500 to-emerald-600',
    bgLight: 'bg-emerald-50',
    textColor: 'text-emerald-600'
  },
  {
    title: 'Galerija',
    description: 'Augšupielādēt un pārvaldīt foto galerijas',
    href: '/admin/gallery',
    icon: Images,
    color: 'from-purple-500 to-purple-600',
    bgLight: 'bg-purple-50',
    textColor: 'text-purple-600'
  },
  {
    title: 'Spēlētāji',
    description: 'Pārvaldīt spēlētāju profilus un informāciju',
    href: '/admin/players',
    icon: Users,
    color: 'from-amber-500 to-amber-600',
    bgLight: 'bg-amber-50',
    textColor: 'text-amber-600'
  },
  {
    title: 'Treneri',
    description: 'Atjaunot treneru informāciju',
    href: '/admin/coaches',
    icon: UserCog,
    color: 'from-rose-500 to-rose-600',
    bgLight: 'bg-rose-50',
    textColor: 'text-rose-600'
  },
  {
    title: 'Treniņu grafiks',
    description: 'Pārvaldīt treniņu laikus un vietas',
    href: '/admin/training',
    icon: Clock,
    color: 'from-cyan-500 to-cyan-600',
    bgLight: 'bg-cyan-50',
    textColor: 'text-cyan-600'
  },
  {
    title: 'Kontakti',
    description: 'Atjaunot kluba kontaktinformāciju',
    href: '/admin/contact',
    icon: Phone,
    color: 'from-teal-500 to-teal-600',
    bgLight: 'bg-teal-50',
    textColor: 'text-teal-600'
  }
]

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-teal-800 shadow-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <LayoutDashboard className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Admin panelis</h1>
                <p className="text-teal-200 text-sm">Pārvaldiet vietnes saturu</p>
              </div>
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
            >
              <Home className="h-4 w-4" />
              Uz sākumu
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Laipni lūdzam!</h2>
          <p className="text-teal-100">
            Izvēlieties sadaļu, ko vēlaties pārvaldīt. Visas izmaiņas tiks publicētas nekavējoties.
          </p>
        </div>

        {/* Management Cards Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {adminSections.map((section) => {
            const Icon = section.icon
            return (
              <Link
                key={section.href}
                href={section.href}
                className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Top gradient bar */}
                <div className={`h-1 bg-gradient-to-r ${section.color}`} />

                <div className="p-6">
                  {/* Icon */}
                  <div className={`inline-flex p-3 rounded-xl ${section.bgLight} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-6 w-6 ${section.textColor}`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-slate-800 mb-2 group-hover:text-teal-700 transition-colors">
                    {section.title}
                  </h3>
                  <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                    {section.description}
                  </p>

                  {/* Action */}
                  <div className={`flex items-center gap-2 text-sm font-medium ${section.textColor}`}>
                    <span>Pārvaldīt</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>

                {/* Hover effect overlay */}
                <div className={`absolute inset-0 bg-gradient-to-r ${section.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300`} />
              </Link>
            )
          })}
        </div>

        {/* Footer info */}
        <div className="mt-10 text-center text-sm text-slate-400">
          <p>RK "Fēnikss" administrācijas panelis</p>
        </div>
      </main>
    </div>
  )
}
