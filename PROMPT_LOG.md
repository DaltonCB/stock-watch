# PROMPT_LOG.md

A log of the AI prompts used during this exercise.

---

## Prompt 1

### 1. The prompt sent
```text
Update Program.cs for a .NET 8 Web API:
- Add controller support with AddControllers() and MapControllers()
- Register StockService via AddHttpClient<StockService>()
- Configure CORS policy allowing http://localhost:5173
- Enable Swagger in development
- Basically get it properly setup
```

### 2. A brief note on why you chose that prompt
I wanted to get the foundational backend architecture configured quickly and accurately so that services, CORS, and routing were properly wired up before writing custom business logic.

### 3. What you kept, changed, or rejected from the AI output and why
I kept nearly all of the agent’s new additions, but noticed that it left some boilerplate default code in Program.cs, so I removed that unnecessary code. I rejected the AI’s attempt to AddOpenApi() as I am targeting .NET 8 for this project since it is better for long term support.

### 4. Description and reasoning behind any manual changes made outside of AI
I removed the unnecessary boilerplate default weather code in Program.cs and adjusted the project to follow .NET 8 instead of .NET 9.

---

## Prompt 2

### 1. The prompt sent
```text
Using this public stock API:
curl "https://query1.finance.yahoo.com/v8/finance/chart/TSLA?interval=15m" -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"

Build out the backend that does the following:
- Takes a stock symbol as a URL parameter (GET /api/stock/{symbol})
- Queries intraday data from the last month
- Groups the 15-minute intraday results by day
- Excludes null/missing data points and empty trading days (weekends/holidays)
- Returns JSON in the following format and precision:
[
  {
    "day": "2009-01-30",
    "lowAverage": 40.2958,
    "highAverage": 49.7534,
    "volume": 49073348
  }
]
Where lowAverage is the average of all valid intraday low prices for that day (from the intervals), highAverage is the average of all valid intraday high prices for that day (from the intervals), and volume is the sum of intraday volumes for that day
```

### 2. A brief note on why you chose that prompt
I wanted the agent to build out the API and create the necessary controller(s) and model(s) and to begin setting up proper responses to give to the frontend. I knew the agent could also quickly understand the Yahoo endpoint more than me going in and manually checking each part of the documentation, though verification on my end was beneficial.

### 3. What you kept, changed, or rejected from the AI output and why
I kept nearly all of the agent’s new additions. These included code for modelling the Yahoo response and structuring the JSON payload. This also included better filling out the StockService.cs file to follow API standards and properly query Yahoo and check the response code. I kept its logic for accumulating the low averages, high averages, and volume. It correctly rounded to 4 decimal places like required and handled null checking as instructed.

### 4. Description and reasoning behind any manual changes made outside of AI
I did not make any manual changes with this prompt.

---

## Prompt 3

### 1. The prompt sent
```text
Using ILogger, add basic and useful log lines to the backend that show important information such as outgoing API requests and errors. Make sure to include some info that would be useful for debugging, but do not become too wordy with log lines.
```

### 2. A brief note on why you chose that prompt
Production level code must have logs for debugging purposes and tracking incidents. I have used logs many times when debugging in my past work experience, and it has helped me solve many bugs. Knowing this, I wanted the AI to build out commonly used and necessary log lines so that the dev can know when and why failures are happening and work from there.

### 3. What you kept, changed, or rejected from the AI output and why
I kept most of the AI added log lines, but removed unnecessary wordiness and also removed specific mentions of Yahoo. This is because I want to keep the log lines more future-proof in the case that StockWatch begins requesting from other sources besides Yahoo down the line. Manually referencing Yahoo removes that genericness that allows it to be more flexible. For example, the AI gave me this line: `_logger.LogWarning("Symbol {Symbol} not found (404) at Yahoo Finance", symbol);` but I changed it to `_logger.LogWarning("Symbol {Symbol} not found (404)", symbol);`.

### 4. Description and reasoning behind any manual changes made outside of AI
I removed specific mentions of Yahoo in order to abstract the implementation and make it more usable for implementations that may use other data sources.

---

## Prompt 4

### 1. The prompt sent
```text
Build a React + TypeScript frontend component for a stock analysis web application using Vite. Start with:

1. Search Bar
- Has text input for entering a stock symbol (default to TSLA so the user starts on something)
- Make sure to have a clean loading spinner and automatically convert inputs to uppercase incase the user wants to type in lowercase

2. Hook with Backend
- Use the backend API and match the JSON response format found in DailyStockAggregrate.cs
- Make sure to handle error responses etc

3. Graph
- Start with a nice visual graph to display the data
- Also display the data in number format so the user can quickly read it

4. Style
- Do a modern sleek look that is more oriented towards dark mode but important info pops out in a clean way
- Tailwind CSS is nice for this purpose
```

### 2. A brief note on why you chose that prompt
I wanted to be detailed in my prompt as there are multiple steps to the frontend that have to be considered and broken up. This is also potentially more of a trial and error stage in terms of look and feel, so I wanted to start with a good baseline given to me from the agent and these features seem the most important to me. A search bar is the best way for the user to interact with the app, and a graph would be a clean visualization. I also wanted to ensure that the AI handled error cases. I wanted the AI to use Tailwind CSS as I have experience working on it in my own time and really like how nicely it can style looks.

### 3. What you kept, changed, or rejected from the AI output and why
I kept most of the AI’s additions here. It did a really great job on the graph and table being really user-friendly. I debugged and tested different stocks and saw that it handled error cases in a good way as well without overcomplicating the messages. I immediately ran into a bug where the frontend was incorrectly giving an error to the user saying that the backend wasn’t running. I manually checked the log lines for the backend and saw that it was running and figured out that the frontend was incorrectly using a try-catch block, which I fixed myself (described in the next section). I also changed the fill color and opacity it used for the volume bars in the graph to more of a clear purple as it was using a grey color that did not really fit well.

### 4. Description and reasoning behind any manual changes made outside of AI
I had to reject and change one of its added try-catch blocks after testing. The AI incorrectly immediately threw a new StockApiError which prevented the frontend from properly receiving the backend response, even though I verified with backend logs that it was being hit. This was causing an issue, so I had to manually add a re-throw AbortError unwrapped and only wrap other real network failures as StockApiError. I also changed the fill color to hex #6366f1 and opacity to 0.25 for the volume bars in the graph.

---

## Prompt 5

### 1. The prompt sent
```text
Add clean and dev-friendly front-end logging for things like fetching api requests and use a consistent format of [StockWatch - Timestamp] "message". Do not make the log lines wordy and do not log anything secret or sensitive.
```

### 2. A brief note on why you chose that prompt
I wanted to add simple and clear frontend logs as well for the purpose of debugging and seeing what the app is doing at a given time. I have used frontend logs many times when working with mobile apps in my previous work experience, and I know how important they can be. I also wanted to build out a simple logger helper that clearly formats each line so they are easily readable. It is also important that no sensitive information is shared in these logs, as they are very easily visible.

### 3. What you kept, changed, or rejected from the AI output and why
Not many lines of code were added here (about 35 or so) and I kept pretty much all of it. The AI cleanly built the logger.ts tool and correctly spread out logs, warnings, and errors. It followed the format I gave of [StockWatch - Timestamp] “message” and kept log lines short to avoid clogging the console. It shared no sensitive information. I only changed the “fetching” log whenever the frontend gets the response from the backend to include “...” at the end to show that it is in progress.

### 4. Description and reasoning behind any manual changes made outside of AI
I only changed the “fetching” log whenever the frontend gets the response from the backend to include “...” at the end to show that it is in progress. No other manual changes were made.

---

## Prompt 6

### 1. The prompt sent
```text
Build out a README.md for the entire project - Setup and run instructions so a reviewer can build and run both backend and frontend locally with clear steps and nice formatting while being concise
```

### 2. A brief note on why you chose that prompt
I wanted the AI to go over the project structure and details and put together a simple and concise README that anyone could follow to build the project.

### 3. What you kept, changed, or rejected from the AI output and why
I kept a large chunk of the README it generated but made some edits. It correctly gave the build steps and mentioned the prerequisites and dependencies. It also mentions some useful notes and info about how responses are handled. I made some edits to mention how it does use Yahoo’s endpoint but is built in a way that you could potentially hook it up to other data sources. I also made sure to mention exactly what ports on localhost the frontend and backend end up typically running on.

### 4. Description and reasoning behind any manual changes made outside of AI
I edited mentions of Yahoo’s endpoint to include the detail that it was built with other potential data sources in mind (I attempted to abstract that logic a bit). I also added what ports the frontend and backend typically end up running on so the user sees the specific numbers.
