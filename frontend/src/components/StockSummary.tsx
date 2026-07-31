import type { DailyStockAggregate } from '../types/stock'

interface StockSummaryProps {
  symbol: string
  data: DailyStockAggregate[]
}

function formatVolume(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(2)}K`
  return value.toString()
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent?: string
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-1 font-mono text-2xl font-semibold ${accent ?? 'text-slate-100'}`}>
        {value}
      </p>
    </div>
  )
}

export default function StockSummary({ symbol, data }: StockSummaryProps) {
  if (data.length === 0) return null

  const latest = [...data].sort((a, b) => b.day.localeCompare(a.day))[0]
  const periodHigh = Math.max(...data.map((d) => d.highAverage))
  const periodLow = Math.min(...data.map((d) => d.lowAverage))
  const totalVolume = data.reduce((sum, d) => sum + d.volume, 0)

  return (
    <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      <StatCard label={`${symbol} · Latest High`} value={`$${latest.highAverage.toFixed(2)}`} accent="text-emerald-400" />
      <StatCard label={`${symbol} · Latest Low`} value={`$${latest.lowAverage.toFixed(2)}`} accent="text-sky-400" />
      <StatCard label="Period High" value={`$${periodHigh.toFixed(2)}`} />
      <StatCard label="Period Low" value={`$${periodLow.toFixed(2)}`} />
      <StatCard label="Total Volume" value={formatVolume(totalVolume)} />
    </div>
  )
}
