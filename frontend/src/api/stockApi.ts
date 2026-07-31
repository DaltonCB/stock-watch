import type { DailyStockAggregate } from '../types/stock'
import { logger } from '../lib/logger'

export class StockApiError extends Error {
  status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'StockApiError'
    this.status = status
  }
}

export async function fetchDailyAggregates(
  symbol: string,
  signal?: AbortSignal,
): Promise<DailyStockAggregate[]> {
  const trimmedSymbol = symbol.trim()

  if (!trimmedSymbol) {
    throw new StockApiError('Enter a stock symbol.')
  }

  const requestUrl = `/api/stock/${encodeURIComponent(trimmedSymbol)}`
  let response: Response

  logger.info(`Fetching ${requestUrl}...`)

  try {
    response = await fetch(requestUrl, { signal })
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      logger.info(`Request aborted for ${trimmedSymbol}`)
      throw err
    }
    logger.error(`Network error fetching ${trimmedSymbol}`)
    throw new StockApiError('Could not reach the server. Is the backend running?')
  }

  if (!response.ok) {
    const message = await response.text().catch(() => '')
    logger.warn(`Request for ${trimmedSymbol} failed with status ${response.status}`)

    if (response.status === 404) {
      throw new StockApiError(`No data found for symbol "${trimmedSymbol}".`, 404)
    }

    throw new StockApiError(
      message || `Request failed with status ${response.status}.`,
      response.status,
    )
  }

  const data = (await response.json()) as DailyStockAggregate[]
  logger.info(`Received ${data.length} day(s) for ${trimmedSymbol}`)
  return data
}
