import { DailyMarketBar, BacktestTrade, ClarificationChoices } from '@/lib/types/research';
import { identifySignals } from './signals';

export interface BacktestExecutionResult {
  trades: BacktestTrade[];
  equityCurve: {
    date: string;
    strategyEquity: number;
    baselineEquity: number;
    benchmarkPrice: number;
    hasSignal: boolean;
  }[];
  signalFlags: boolean[];
}

export function runBacktest(
  bars: DailyMarketBar[],
  clarifications: ClarificationChoices
): BacktestExecutionResult {
  const signalFlags = identifySignals(bars, {
    entryThresholdPct: clarifications.entryThresholdPct,
    volatilityRegime: clarifications.volatilityRegime,
  });

  const holdingDays = Math.max(1, clarifications.holdingPeriodDays);
  const costDecimal = (2 * clarifications.costBps) / 10000; // Round-trip costs in decimal
  const trades: BacktestTrade[] = [];

  // Trade Generation: Event-study methodology
  for (let i = 0; i < bars.length - holdingDays; i++) {
    if (signalFlags[i]) {
      const entryBar = bars[i];
      const exitBar = bars[i + holdingDays];
      const grossReturn = exitBar.close / entryBar.close - 1;
      const netReturn = grossReturn - costDecimal;

      let regime: 'normal' | 'high_volatility' | 'low_volatility' = 'normal';
      if (entryBar.volatilityPercentile >= 0.75) regime = 'high_volatility';
      else if (entryBar.volatilityPercentile <= 0.25) regime = 'low_volatility';

      trades.push({
        id: `trade-${i}`,
        entryDate: entryBar.date,
        entryPrice: entryBar.close,
        exitDate: exitBar.date,
        exitPrice: exitBar.close,
        holdingDays,
        grossReturn,
        netReturn,
        isWin: netReturn > 0,
        entryVolatilityRegime: regime,
      });
    }
  }

  // Daily Equity Curve Simulation
  // Strategy: Invested during holding days following a qualifying signal
  // Baseline: 100% buy and hold from Day 0
  const equityCurve: {
    date: string;
    strategyEquity: number;
    baselineEquity: number;
    benchmarkPrice: number;
    hasSignal: boolean;
  }[] = [];

  let strategyEq = 100;
  let baselineEq = 100;
  const initialBenchmarkPrice = bars[0].close;

  // Track active holding countdown: if > 0, strategy participates in today's return
  let activeHoldingRemaining = 0;

  for (let i = 0; i < bars.length; i++) {
    const bar = bars[i];
    const dailyRet = bar.returnPct;

    // Baseline updates daily
    baselineEq = baselineEq * (1 + dailyRet);

    // If strategy was active from previous day's signal
    if (activeHoldingRemaining > 0) {
      // Strategy participates in daily return
      strategyEq = strategyEq * (1 + dailyRet);
      activeHoldingRemaining--;
    }

    // Check if new signal triggers today at close
    const hasSignal = signalFlags[i];
    if (hasSignal) {
      // Deduct transaction cost on entry
      strategyEq = strategyEq * (1 - costDecimal / 2);
      activeHoldingRemaining = holdingDays;
    }

    equityCurve.push({
      date: bar.date,
      strategyEquity: Math.round(strategyEq * 100) / 100,
      baselineEquity: Math.round(baselineEq * 100) / 100,
      benchmarkPrice: bar.close,
      hasSignal,
    });
  }

  return {
    trades,
    equityCurve,
    signalFlags,
  };
}
