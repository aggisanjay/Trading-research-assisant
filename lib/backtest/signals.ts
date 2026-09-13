import { DailyMarketBar } from '@/lib/types/research';

export interface SignalCriteria {
  entryThresholdPct: number; // e.g. 1 for 1%
  volatilityRegime: 'all' | 'high_volatility' | 'low_volatility';
}

export function identifySignals(bars: DailyMarketBar[], criteria: SignalCriteria): boolean[] {
  const thresholdDecimal = -(criteria.entryThresholdPct / 100);

  return bars.map((bar) => {
    // Entry condition: today's return dropped by >= threshold
    const qualifiesReturn = bar.returnPct <= thresholdDecimal;
    if (!qualifiesReturn) return false;

    // Volatility filter
    if (criteria.volatilityRegime === 'high_volatility') {
      return bar.volatilityPercentile >= 0.75;
    } else if (criteria.volatilityRegime === 'low_volatility') {
      return bar.volatilityPercentile <= 0.25;
    }

    return true;
  });
}
