namespace backend.Models;

public class YahooChartResponse
{
    public YahooChart? Chart { get; set; }
}

public class YahooChart
{
    public List<YahooChartResult>? Result { get; set; }
    public object? Error { get; set; }
}

public class YahooChartResult
{
    public YahooChartMeta? Meta { get; set; }
    public List<long>? Timestamp { get; set; }
    public YahooIndicators? Indicators { get; set; }
}

public class YahooChartMeta
{
    public long GmtOffset { get; set; }
    public string? Timezone { get; set; }
}

public class YahooIndicators
{
    public List<YahooQuote>? Quote { get; set; }
}

public class YahooQuote
{
    public List<double?>? Low { get; set; }
    public List<double?>? High { get; set; }
    public List<long?>? Volume { get; set; }
}
