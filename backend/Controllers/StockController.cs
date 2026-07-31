using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/stock")]
public class StockController : ControllerBase
{
    private readonly StockService _stockService;
    private readonly ILogger<StockController> _logger;

    public StockController(StockService stockService, ILogger<StockController> logger)
    {
        _stockService = stockService;
        _logger = logger;
    }

    [HttpGet("{symbol}")]
    public async Task<IActionResult> GetStock(string symbol, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(symbol))
        {
            _logger.LogWarning("Rejected request with missing symbol");
            return BadRequest("Symbol is required.");
        }

        _logger.LogInformation("Handling GET /api/stock/{Symbol}", symbol);

        List<Models.DailyStockAggregate>? aggregates;
        try
        {
            aggregates = await _stockService.GetDailyAggregatesAsync(symbol, cancellationToken);
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "Request to upstream stock API failed for {Symbol}", symbol);
            return StatusCode(StatusCodes.Status502BadGateway, "Failed to retrieve stock data.");
        }

        if (aggregates is null)
        {
            return NotFound($"No data found for symbol '{symbol}'.");
        }

        return Ok(aggregates);
    }
}
