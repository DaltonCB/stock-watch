import type { DailyStockAggregate } from '../types/stock'

interface StockTableProps {
  data: DailyStockAggregate[]
}

function formatDay(day: string): string {
  const date = new Date(`${day}T00:00:00`)
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export default function StockTable({ data }: StockTableProps) {
  const sortedDesc = [...data].sort((a, b) => b.day.localeCompare(a.day))

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50">
      <div className="max-h-96 overflow-y-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 bg-slate-900">
            <tr className="text-left text-slate-400">
              <th className="px-4 py-3 font-medium">Day</th>
              <th className="px-4 py-3 text-right font-medium">Low Avg</th>
              <th className="px-4 py-3 text-right font-medium">High Avg</th>
              <th className="px-4 py-3 text-right font-medium">Volume</th>
            </tr>
          </thead>
          <tbody>
            {sortedDesc.map((row) => (
              <tr
                key={row.day}
                className="border-t border-slate-800 text-slate-200 hover:bg-slate-800/50"
              >
                <td className="px-4 py-2.5 font-mono text-slate-300">{formatDay(row.day)}</td>
                <td className="px-4 py-2.5 text-right font-mono text-sky-400">
                  ${row.lowAverage.toFixed(2)}
                </td>
                <td className="px-4 py-2.5 text-right font-mono text-emerald-400">
                  ${row.highAverage.toFixed(2)}
                </td>
                <td className="px-4 py-2.5 text-right font-mono text-slate-400">
                  {row.volume.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
