'use client'

import { useState, useEffect, useCallback } from 'react'
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
  Clock,
  Eye,
  TrendingUp,
  CalendarDays,
  BarChart3
} from 'lucide-react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'

const chartConfig = {
  views: {
    label: 'Skatījumi',
    color: 'hsl(173, 58%, 39%)',
  },
} satisfies ChartConfig

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

type Period = 'week' | 'month' | 'year'

type Stats = {
  totalViews: number
  todayViews: number
  weekViews: number
  monthViews: number
  chartData: { date: string; views: number }[]
}

const periodLabels: Record<Period, string> = {
  week: 'Nedēļa',
  month: 'Mēnesis',
  year: 'Gads',
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [period, setPeriod] = useState<Period>('week')
  const [loading, setLoading] = useState(true)

  const fetchStats = useCallback((p: Period) => {
    setLoading(true)
    fetch(`/api/page-views?period=${p}`)
      .then(res => res.json())
      .then(data => {
        if (data.totalViews !== undefined) {
          setStats(data)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchStats(period)
  }, [period, fetchStats])

  const handlePeriodChange = (p: Period) => {
    setPeriod(p)
  }

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

        {/* Page View Stats */}
        {stats && (
          <div className="mb-8 space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-3">
                <div className="inline-flex p-2.5 rounded-xl bg-teal-50">
                  <Eye className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Šodien</p>
                  <p className="text-xl font-bold text-slate-800">{stats.todayViews.toLocaleString()}</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-3">
                <div className="inline-flex p-2.5 rounded-xl bg-emerald-50">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Šonedēļ</p>
                  <p className="text-xl font-bold text-slate-800">{stats.weekViews.toLocaleString()}</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-3">
                <div className="inline-flex p-2.5 rounded-xl bg-blue-50">
                  <CalendarDays className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Šomēnes</p>
                  <p className="text-xl font-bold text-slate-800">{stats.monthViews.toLocaleString()}</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-3">
                <div className="inline-flex p-2.5 rounded-xl bg-purple-50">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Kopā</p>
                  <p className="text-xl font-bold text-slate-800">{stats.totalViews.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-800">Skatījumu statistika</h3>
                <div className="flex bg-slate-100 rounded-lg p-1">
                  {(Object.keys(periodLabels) as Period[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => handlePeriodChange(p)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                        period === p
                          ? 'bg-teal-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-800'
                      }`}
                    >
                      {periodLabels[p]}
                    </button>
                  ))}
                </div>
              </div>

              {loading ? (
                <div className="h-[300px] flex items-center justify-center text-slate-400 text-sm">
                  Ielādē...
                </div>
              ) : stats.chartData.length > 0 ? (
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                  <AreaChart
                    data={stats.chartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="fillViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-views)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--color-views)" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      fontSize={12}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      fontSize={12}
                      allowDecimals={false}
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                    />
                    <Area
                      type="monotone"
                      dataKey="views"
                      stroke="var(--color-views)"
                      strokeWidth={2}
                      fill="url(#fillViews)"
                    />
                  </AreaChart>
                </ChartContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-slate-400 text-sm">
                  Nav datu šim periodam
                </div>
              )}
            </div>
          </div>
        )}

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
