# Stock Watch

A stock analysis dashboard that visualizes intraday-derived daily low/high price averages and volume for a given stock over the last month in both a graph and table format.

- **Backend:** ASP.NET Core (.NET 8) Web API that pulls 15-minute intraday data and aggregates it into daily stats.
- **Frontend:** React + TypeScript (Vite) with Tailwind CSS and Recharts.

## Prerequisites

| Tool | Version |
|---|---|
| [.NET SDK](https://dotnet.microsoft.com/download) | 8.0+ |
| [Node.js](https://nodejs.org/) | 20+ (includes npm) |

## 1. Run the backend

```powershell
cd backend
dotnet run
```

The API starts at `http://localhost:5201` (see [backend/Properties/launchSettings.json](backend/Properties/launchSettings.json)). Swagger UI is available at `http://localhost:5201/swagger` in development.

**Endpoint:**

```
GET /api/stock/{symbol}
```

Returns the last month of daily aggregates for a stock, e.g. `GET /api/stock/TSLA`:

```json
[
  { "day": "2026-07-30", "lowAverage": 306.00, "highAverage": 307.96, "volume": 33011735 }
]
```

## 2. Run the frontend

In a separate terminal:

```powershell
cd frontend
npm install
npm run dev
```

The app starts at `http://localhost:5173` and proxies `/api` requests to the backend at `http://localhost:5201` (see [frontend/vite.config.ts](frontend/vite.config.ts)). Make sure the backend is running first.

Open `http://localhost:5173` in your browser, enter a stock symbol (defaults to `TSLA`), and press Search.

## Other useful commands

**Backend** (from `backend/`):

```powershell
dotnet build   # compile
```

**Frontend** (from `frontend/`):

```powershell
npm run build  # type-check + production build
npm run lint   # run ESLint
```

## Project structure

```
backend/     ASP.NET Core Web API (controllers, services, models)
frontend/    React + TypeScript app (components, API client)
```

## Notes

- The backend currently calls Yahoo Finance's unofficial/undocumented chart endpoint but is built in mind for different future integrations.
- CORS is configured on the backend to allow requests from `http://localhost:5173` only.
