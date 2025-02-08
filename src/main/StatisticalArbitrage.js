const StatisticalArbitrage = {
      // Store recent prices for each ticker.  Limited by lack of persistence.
      priceHistory: {},

      updatePriceHistory(ticker, price) {
        if (!StatisticalArbitrage.priceHistory[ticker]) {
          StatisticalArbitrage.priceHistory[ticker] = [];
        }
        StatisticalArbitrage.priceHistory[ticker].push({ price, timestamp: Date.now() });

        // Limit history size (e.g., last 100 prices)
        if (StatisticalArbitrage.priceHistory[ticker].length > 100) {
          StatisticalArbitrage.priceHistory[ticker].shift();
        }
      },

      // Calculate a simple moving average.
      calculateSMA(ticker, period = 20) {
        const history = StatisticalArbitrage.priceHistory[ticker];
        if (!history || history.length < period) return null;

        const relevantHistory = history.slice(-period);
        const sum = relevantHistory.reduce((acc, { price }) => acc + price, 0);
        return sum / period;
      },

      // Check for mean reversion opportunity.
      isMeanReversionOpportunity(ticker, currentPrice) {
        const sma = StatisticalArbitrage.calculateSMA(ticker);
        if (!sma) return false;

        // Define a threshold for deviation from the mean (e.g., 1%).
        const threshold = sma * 0.01;

        // If the current price is significantly below the SMA, it's a potential buy.
        // If it's significantly above, it's a potential sell.
        if (currentPrice < sma - threshold) return 'BUY';
        if (currentPrice > sma + threshold) return 'SELL';
        return false;
      },
    };

    module.exports = StatisticalArbitrage;
