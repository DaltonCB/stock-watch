using System.Net.Http.Json;
using System.Text.Json;
using backend.Models;

namespace backend.Services;

public class StockService
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    private readonly HttpClient _httpClient;
    private readonly ILogger<StockService> _logger;

    public StockService(HttpClient httpClient, ILogger<StockService> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
    }

    /// <summary>
    /// Fetches the last month of 15-minute intraday data for the given symbol and
    /// groups it into per-day low/high averages and total volume.
    /// Returns null if the symbol could not be found.
    /// </summary>
    public async Task<List<DailyStockAggregate>?> GetDailyAggregatesAsync(string symbol, CancellationToken cancellationToken = default)
    {
        var requestUri = $"v8/finance/chart/{Uri.EscapeDataString(symbol)}?interval=15m&range=1mo";
        _logger.LogInformation("Requesting intraday data for {Symbol} from {RequestUri}", symbol, requestUri);

        using var response = await _httpClient.GetAsync(requestUri, cancellationToken);

        if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            _logger.LogWarning("Symbol {Symbol} not found (404)", symbol);
            return null;
        }

        if (!response.IsSuccessStatusCode)
        {
            _logger.LogError("Request for {Symbol} failed with status {StatusCode}", symbol, (int)response.StatusCode);
        }

        response.EnsureSuccessStatusCode();

        var payload = await response.Content.ReadFromJsonAsync<YahooChartResponse>(JsonOptions, cancellationToken);
        var result = payload?.Chart?.Result?.FirstOrDefault();

        if (result?.Timestamp is null || result.Indicators?.Quote?.FirstOrDefault() is not { } quote)
        {
            _logger.LogWarning("No usable chart data returned for {Symbol}", symbol);
            return null;
        }

        var gmtOffsetSeconds = result.Meta?.GmtOffset ?? 0;
        var timestamps = result.Timestamp;
        var lows = quote.Low;
        var highs = quote.High;
        var volumes = quote.Volume;

        var dailyGroups = new SortedDictionary<string, DailyAccumulator>(StringComparer.Ordinal);

        for (var i = 0; i < timestamps.Count; i++)
        {
            var low = lows is not null && i < lows.Count ? lows[i] : null;
            var high = highs is not null && i < highs.Count ? highs[i] : null;
            var volume = volumes is not null && i < volumes.Count ? volumes[i] : null;

            // Exclude intervals with any missing data.
            if (low is null || high is null || volume is null)
            {
                continue;
            }

            var localTimestamp = DateTimeOffset.FromUnixTimeSeconds(timestamps[i] + gmtOffsetSeconds);
            var day = localTimestamp.UtcDateTime.ToString("yyyy-MM-dd");

            if (!dailyGroups.TryGetValue(day, out var accumulator))
            {
                accumulator = new DailyAccumulator();
                dailyGroups[day] = accumulator;
            }

            accumulator.LowSum += low.Value;
            accumulator.HighSum += high.Value;
            accumulator.Volume += volume.Value;
            accumulator.Count++;
        }

        var aggregates = dailyGroups
            .Where(entry => entry.Value.Count > 0)
            .Select(entry => new DailyStockAggregate(
                entry.Key,
                Math.Round(entry.Value.LowSum / entry.Value.Count, 4),
                Math.Round(entry.Value.HighSum / entry.Value.Count, 4),
                entry.Value.Volume))
            .ToList();

        _logger.LogInformation("Aggregated {DayCount} trading day(s) for {Symbol} from {IntervalCount} interval(s)", aggregates.Count, symbol, timestamps.Count);

        return aggregates;
    }

    private sealed class DailyAccumulator
    {
        public double LowSum { get; set; }
        public double HighSum { get; set; }
        public long Volume { get; set; }
        public int Count { get; set; }
    }
}
