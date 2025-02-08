const CONFIG = require('../../config/config');

const Statistics = {

    calculateRollingAverage(data, period = CONFIG.STATISTICS.ROLLING_AVERAGE_PERIOD) {
        if (data.length < period) {
            return null; // Not enough data
        }
        const relevantData = data.slice(-period);
        const sum = relevantData.reduce((acc, val) => acc + val, 0);
        return sum / period;
    },

    calculateStandardDeviation(data, period = CONFIG.STATISTICS.ROLLING_AVERAGE_PERIOD) {
        if (data.length < period) {
            return null; // Not enough data
        }
        const relevantData = data.slice(-period);
        const average = Statistics.calculateRollingAverage(relevantData, period);
        if (average === null) return null;

        const squareDiffs = relevantData.map(value => {
            const diff = value - average;
            return diff * diff;
        });
        const avgSquareDiff = Statistics.calculateRollingAverage(squareDiffs, period);
        return Math.sqrt(avgSquareDiff);
    },

    calculateZScore(value, data, period = CONFIG.STATISTICS.ROLLING_AVERAGE_PERIOD) {
        const average = Statistics.calculateRollingAverage(data, period);
        const stdDev = Statistics.calculateStandardDeviation(data, period);

        if (average === null || stdDev === null || stdDev === 0) {
            return null;
        }

        return (value - average) / stdDev;
    }
};

module.exports = Statistics;
