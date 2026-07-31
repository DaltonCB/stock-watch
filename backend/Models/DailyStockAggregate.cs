using System.Text.Json.Serialization;

namespace backend.Models;

public record DailyStockAggregate(
    [property: JsonPropertyName("day")] string Day,
    [property: JsonPropertyName("lowAverage")] double LowAverage,
    [property: JsonPropertyName("highAverage")] double HighAverage,
    [property: JsonPropertyName("volume")] long Volume);
