const CONFIG = require('../../config/config');

    const KellyCriterion = {
        calculatePositionSize(calculated) {
            // Basic Kelly Criterion implementation.  This is a simplified version
            // and does *not* account for multiple outcomes, partial losses, etc.
            // It's also limited by the lack of historical data persistence.

            // winProbability:  Estimated from recent success rates (very rough estimate).
            // winLossRatio:    Ratio of potential profit to potential loss (simplified).

            // We'll use the calculated.percent as a proxy for potential profit.
            // For potential loss, we'll assume a fixed percentage (e.g., 0.5%)
            // as a worst-case scenario.  This is a HUGE simplification.

            const winProbability = KellyCriterion.estimateWinProbability(calculated); // Implement this
            const potentialProfit = calculated.percent / 100; // Convert to decimal
            const potentialLoss = 0.005; // Fixed 0.5% potential loss (simplified)
            const winLossRatio = potentialProfit / potentialLoss;

            if (winLossRatio <= 0) return 0; // Avoid division by zero or negative ratios

            let kellyFraction = winProbability - ((1 - winProbability) / winLossRatio);

            // Apply constraints
            kellyFraction = Math.max(0, kellyFraction); // Ensure it's not negative
            kellyFraction = Math.min(1, kellyFraction); // Ensure it's not greater than 1 (100%)

            // Adjust investment based on Kelly fraction, within min/max bounds
            const base = calculated.trade.symbol.a;
            let investmentAmount = CONFIG.INVESTMENT[base].MAX * kellyFraction;
            investmentAmount = Math.max(CONFIG.INVESTMENT[base].MIN, investmentAmount);
            investmentAmount = Math.min(CONFIG.INVESTMENT[base].MAX, investmentAmount);

            return investmentAmount;
        },

        // Very rudimentary win probability estimation.
        estimateWinProbability(calculated) {
            // We'll use a simple moving average of recent success/failure.
            // This is highly limited by the lack of persistent storage.
            const history = KellyCriterion.getCalculationHistory(calculated.id);
            if (history.length === 0) return 0.5; // Default to 50% if no history

            const successCount = history.filter(result => result === 'success').length;
            return successCount / history.length;
        },

        calculationHistory: {}, // Store recent calculation results (success/failure)

        addToCalculationHistory(calculationId, result) {
            if (!KellyCriterion.calculationHistory[calculationId]) {
                KellyCriterion.calculationHistory[calculationId] = [];
            }
            KellyCriterion.calculationHistory[calculationId].push(result);

            // Limit history size (e.g., last 20 calculations)
            if (KellyCriterion.calculationHistory[calculationId].length > 20) {
                KellyCriterion.calculationHistory[calculationId].shift();
            }
        },
        getCalculationHistory(calculationId){
            return KellyCriterion.calculationHistory[calculationId] ? KellyCriterion.calculationHistory[calculationId] : [];
        }
    };

    module.exports = KellyCriterion;
