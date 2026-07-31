import { useEffect, useState } from 'react'
import SearchBar from './components/SearchBar'
import StockChart from './components/StockChart'
import StockTable from './components/StockTable'
import StockSummary from './components/StockSummary'
import { fetchDailyAggregates, StockApiError } from './api/stockApi'
import type { DailyStockAggregate } from './types/stock'
import { logger } from './lib/logger'

function App() {
  const [symbol, setSymbol] = useState('TSLA')
  const [data, setData] = useState<DailyStockAggregate[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    Promise.resolve()
      .then(() => {
        setIsLoading(true)
        setError(null)
        return fetchDailyAggregates(symbol, controller.signal)
      })
      .then((result) => {
        setData(result)
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return
        logger.error(`Failed to load ${symbol}`)
        setData([])
        setError(err instanceof StockApiError ? err.message : 'Something went wrong.')
      })
      .finally(() => {
        setIsLoading(false)
      })

    return () => controller.abort()
  }, [symbol])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-slate-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 sm:px-6">
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-50">Stock Watch</h1>
          <p className="text-sm text-slate-400">
            Intraday-derived daily low/high averages and volume, last 30 days.
          </p>
        </header>

        <SearchBar onSearch={setSymbol} isLoading={isLoading} />

        {error && (
          <div className="rounded-lg border border-red-900 bg-red-950/50 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {!error && data.length > 0 && (
          <>
            <StockSummary symbol={symbol} data={data} />
            <StockChart data={data} />
            <StockTable data={data} />
          </>
        )}

        {!error && !isLoading && data.length === 0 && (
          <div className="rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-8 text-center text-sm text-slate-500">
            No data to display yet.
          </div>
        )}
      </div>
    </div>
  )
}

export default App
