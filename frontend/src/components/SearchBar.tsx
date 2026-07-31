import { useState } from 'react'
import type { FormEvent } from 'react'

interface SearchBarProps {
  onSearch: (symbol: string) => void
  isLoading: boolean
}

export default function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [symbol, setSymbol] = useState('TSLA')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!isLoading && symbol.trim()) {
      onSearch(symbol.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-2">
      <div className="relative flex-1">
        <input
          type="text"
          value={symbol}
          onChange={(event) => setSymbol(event.target.value.toUpperCase())}
          placeholder="Enter symbol (e.g. TSLA)"
          maxLength={10}
          spellCheck={false}
          autoCapitalize="characters"
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 font-mono text-lg tracking-wider text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || !symbol.trim()}
        className="flex min-w-[110px] items-center justify-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 font-semibold text-slate-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
      >
        {isLoading ? (
          <>
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/40 border-t-slate-950"
              aria-hidden="true"
            />
            <span>Loading</span>
          </>
        ) : (
          'Search'
        )}
      </button>
    </form>
  )
}
