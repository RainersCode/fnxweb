'use client'

import { useEffect, useState } from 'react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'

type Period = 'week' | 'month' | 'year'
type Stats = { totalViews: number; todayViews: number; weekViews: number; monthViews: number; chartData: { date: string; views: number }[] }

const chartConfig = { views: { label: 'Skatījumi', color: '#014D43' } } satisfies ChartConfig
const periods: { key: Period; label: string }[] = [
  { key: 'week', label: 'Nedēļa' },
  { key: 'month', label: 'Mēnesis' },
  { key: 'year', label: 'Gads' },
]

export function VisitorStats() {
  const [period, setPeriod] = useState<Period>('week')
  const [stats, setStats] = useState<Stats | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    setFailed(false)
    fetch(`/api/page-views?period=${period}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: Stats) => { if (!cancelled) setStats(data) })
      .catch(() => { if (!cancelled) setFailed(true) })
    return () => { cancelled = true }
  }, [period])

  return (
    <section className="rounded-lg border border-[#DCE3DF] bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-semibold">Apmeklējumi</h2>
        <div className="flex gap-1 rounded-md bg-club-pale p-1">
          {periods.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => setPeriod(p.key)}
              className={`rounded px-3 py-1 text-sm font-semibold ${period === p.key ? 'bg-white shadow-sm' : 'text-[#5B6863]'}`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
      {failed ? (
        <p className="mt-4 text-sm text-[#5B6863]">Neizdevās ielādēt statistiku.</p>
      ) : (
        <>
          <dl className="mt-4 grid grid-cols-3 gap-3">
            {[
              ['Šodien', stats?.todayViews],
              ['Nedēļā', stats?.weekViews],
              ['Mēnesī', stats?.monthViews],
            ].map(([label, value]) => (
              <div key={label as string} className="rounded-md bg-[#F4F6F5] p-3">
                <dt className="text-xs font-semibold uppercase tracking-wide text-[#5B6863]">{label}</dt>
                <dd className="mt-1 text-2xl font-bold tabular-nums">{value ?? '–'}</dd>
              </div>
            ))}
          </dl>
          <ChartContainer config={chartConfig} className="mt-4 h-40 w-full">
            <AreaChart data={stats?.chartData ?? []} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} minTickGap={24} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area dataKey="views" type="monotone" stroke="var(--color-views)" fill="var(--color-views)" fillOpacity={0.15} />
            </AreaChart>
          </ChartContainer>
        </>
      )}
    </section>
  )
}
