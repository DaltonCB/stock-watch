import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { DailyStockAggregate } from '../types/stock'

interface StockChartProps {
  data: DailyStockAggregate[]
}

function formatVolume(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`
  return value.toString()
}

function formatDay(day: string): string {
  const date = new Date(`${day}T00:00:00`)
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

interface TooltipPayloadEntry {
  name: string
  value: number
  color: string
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: TooltipPayloadEntry[]
  label?: string
}) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900/95 px-3 py-2 text-sm shadow-xl">
      <p className="mb-1 font-semibold text-slate-200">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}:{' '}
          {entry.name === 'Volume'
            ? formatVolume(entry.value)
            : `$${entry.value.toFixed(2)}`}
        </p>
      ))}
    </div>
  )
}

export default function StockChart({ data }: StockChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    dayLabel: formatDay(d.day),
  }))

  return (
    <div className="h-80 w-full rounded-xl border border-slate-800 bg-slate-900/50 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="highGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="lowGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="dayLabel"
            stroke="#64748b"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            tickLine={false}
          />
          <YAxis
            yAxisId="price"
            stroke="#64748b"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            domain={['auto', 'auto']}
            tickFormatter={(value: number) => `$${value.toFixed(0)}`}
            width={56}
          />
          <YAxis
            yAxisId="volume"
            orientation="right"
            stroke="#64748b"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatVolume}
            width={48}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#475569', strokeWidth: 1 }} />
          <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
          <Bar
            yAxisId="volume"
            dataKey="volume"
            name="Volume"
            fill="#6366f1"
            fillOpacity={0.25}
            radius={[2, 2, 0, 0]}
            barSize={18}
          />
          <Area
            yAxisId="price"
            type="monotone"
            dataKey="highAverage"
            name="High Avg"
            stroke="#34d399"
            strokeWidth={2}
            fill="url(#highGradient)"
          />
          <Area
            yAxisId="price"
            type="monotone"
            dataKey="lowAverage"
            name="Low Avg"
            stroke="#38bdf8"
            strokeWidth={2}
            fill="url(#lowGradient)"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
