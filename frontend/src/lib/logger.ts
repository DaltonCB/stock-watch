type LogLevel = 'info' | 'warn' | 'error'

function timestamp(): string {
  return new Date().toISOString()
}

function log(level: LogLevel, message: string): void {
  const prefix = `[StockWatch - ${timestamp()}]`

  if (level === 'warn') {
    console.warn(prefix, message)
  } else if (level === 'error') {
    console.error(prefix, message)
  } else {
    console.log(prefix, message)
  }
}

export const logger = {
  info: (message: string) => log('info', message),
  warn: (message: string) => log('warn', message),
  error: (message: string) => log('error', message),
}
