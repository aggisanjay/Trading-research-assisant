import { DailyMarketBar, BacktestTrade, BacktestResult, ClarificationChoices } from '@/lib/types/research';

export function calculateStatistics(
  bars: DailyMarketBar[],
  trades: BacktestTrade[],
  equityCurve: {
    date: string;
    strategyEquity: number;
    baselineEquity: number;
    benchmarkPrice: number;
    hasSignal: boolean;
  }[],
  clarifications: ClarificationChoices
): BacktestResult {
  const totalObservations = bars.length;
  const qualifyingSignals = trades.length;

  if (qualifyingSignals === 0) {
    return {
      totalObservations,
      qualifyingSignals: 0,
      winRate: 0,
      winningTradesCount: 0,
      losingTradesCount: 0,
      avgStrategyReturn: 0,
      medianStrategyReturn: 0,
      unconditionalBaselineReturn: 0,
      estimatedEdge: 0,
      strategyCumulativeReturn: 0,
      baselineCumulativeReturn: 0,
      maxDrawdown: 0,
      profitFactor: 0,
      trades: [],
      equityCurve,
      returnDistribution: [],
      learnings: {
        dataShows: 'No qualifying signals were detected with the current parameters.',
        whatItMightMean: 'The threshold or regime filter is too restrictive for the sample period.',
        whatWeCanReasonablyConclude: 'No statistical test can be performed without qualifying observations.',
      },
    };
  }

  // Win rate and returns
  const winningTrades = trades.filter((t) => t.isWin);
  const losingTrades = trades.filter((t) => !t.isWin);
  const winRate = Math.round((winningTrades.length / qualifyingSignals) * 1000) / 10;

  const returns = trades.map((t) => t.netReturn);
  const avgStrategyReturn = returns.reduce((a, b) => a + b, 0) / qualifyingSignals;

  const sortedReturns = [...returns].sort((a, b) => a - b);
  const mid = Math.floor(sortedReturns.length / 2);
  const medianStrategyReturn =
    sortedReturns.length % 2 !== 0
      ? sortedReturns[mid]
      : (sortedReturns[mid - 1] + sortedReturns[mid]) / 2;

  // Unconditional Baseline: Average n-day holding return across all trading days
  const holdingDays = Math.max(1, clarifications.holdingPeriodDays);
  let totalBaselineReturns = 0;
  let baselineCount = 0;
  for (let i = 0; i < bars.length - holdingDays; i++) {
    const ret = bars[i + holdingDays].close / bars[i].close - 1;
    totalBaselineReturns += ret;
    baselineCount++;
  }
  const unconditionalBaselineReturn = baselineCount > 0 ? totalBaselineReturns / baselineCount : 0;
  const estimatedEdge = avgStrategyReturn - unconditionalBaselineReturn;

  // Max Drawdown calculation on Strategy Equity Curve
  let peak = equityCurve[0]?.strategyEquity || 100;
  let maxDD = 0;
  for (const point of equityCurve) {
    if (point.strategyEquity > peak) {
      peak = point.strategyEquity;
    }
    const dd = (peak - point.strategyEquity) / peak;
    if (dd > maxDD) {
      maxDD = dd;
    }
  }

  // Profit Factor
  const grossProfit = winningTrades.reduce((acc, t) => acc + t.netReturn, 0);
  const grossLoss = Math.abs(losingTrades.reduce((acc, t) => acc + t.netReturn, 0));
  const profitFactor = grossLoss > 0 ? Math.round((grossProfit / grossLoss) * 100) / 100 : grossProfit > 0 ? 99 : 0;

  // Cumulative Returns
  const initialStrategy = equityCurve[0]?.strategyEquity || 100;
  const finalStrategy = equityCurve[equityCurve.length - 1]?.strategyEquity || 100;
  const strategyCumulativeReturn = Math.round(((finalStrategy - initialStrategy) / initialStrategy) * 1000) / 10;

  const initialBaseline = equityCurve[0]?.baselineEquity || 100;
  const finalBaseline = equityCurve[equityCurve.length - 1]?.baselineEquity || 100;
  const baselineCumulativeReturn = Math.round(((finalBaseline - initialBaseline) / initialBaseline) * 1000) / 10;

  // Return Distribution Histogram Bins
  const bins = [
    { range: '< -2%', min: -Infinity, max: -0.02, isPositive: false },
    { range: '-2% to -1%', min: -0.02, max: -0.01, isPositive: false },
    { range: '-1% to 0%', min: -0.01, max: 0, isPositive: false },
    { range: '0% to +1%', min: 0, max: 0.01, isPositive: true },
    { range: '+1% to +2%', min: 0.01, max: 0.02, isPositive: true },
    { range: '> +2%', min: 0.02, max: Infinity, isPositive: true },
  ];

  const returnDistribution = bins.map((bin) => {
    const count = returns.filter((r) => r >= bin.min && r < bin.max).length;
    return {
      range: bin.range,
      count,
      isPositive: bin.isPositive,
    };
  });

  // Convert percentages for UI readability
  const avgStrategyReturnPct = Math.round(avgStrategyReturn * 10000) / 100;
  const medianStrategyReturnPct = Math.round(medianStrategyReturn * 10000) / 100;
  const unconditionalBaselineReturnPct = Math.round(unconditionalBaselineReturn * 10000) / 100;
  const estimatedEdgePct = Math.round(estimatedEdge * 10000) / 100;
  const maxDrawdownPct = Math.round(maxDD * 1000) / 10;

  // Format sign helpers
  const formatSign = (val: number) => (val >= 0 ? `+${val.toFixed(2)}%` : `${val.toFixed(2)}%`);

  // Explicit Learnings Separation
  const dataShows = `Across ${qualifyingSignals} qualifying observations over ${totalObservations} simulated trading days (~${clarifications.testPeriodYears} years), the strategy yielded an average ${holdingDays}-day return of ${formatSign(
    avgStrategyReturnPct
  )}, compared with ${formatSign(unconditionalBaselineReturnPct)} for the unconditional baseline. The win rate was ${winRate.toFixed(
    1
  )}% (${winningTrades.length} wins vs ${losingTrades.length} losses).`;

  const whatItMightMean =
    estimatedEdgePct > 0
      ? `The simulated sample suggests a positive mean-reversion relationship: buying after a ≥${clarifications.entryThresholdPct}% decline delivered an estimated excess return of ${formatSign(
          estimatedEdgePct
        )} over unconditional market holding periods.`
      : `The simulated sample suggests negative drift following sharp falls: entry after a ≥${clarifications.entryThresholdPct}% decline lagged the unconditional baseline by ${formatSign(
          estimatedEdgePct
        )}, suggesting downward momentum rather than immediate mean-reversion.`;

  const whatWeCanReasonablyConclude =
    'The simulated sample shows an empirical difference, but this evidence alone is NOT sufficient to establish an investable trading edge. Real-world execution involves bid-ask spread slippage, exchange fees, timing friction, and non-stationary regime shifts not captured in this prototype.';

  return {
    totalObservations,
    qualifyingSignals,
    winRate,
    winningTradesCount: winningTrades.length,
    losingTradesCount: losingTrades.length,
    avgStrategyReturn: avgStrategyReturnPct,
    medianStrategyReturn: medianStrategyReturnPct,
    unconditionalBaselineReturn: unconditionalBaselineReturnPct,
    estimatedEdge: estimatedEdgePct,
    strategyCumulativeReturn,
    baselineCumulativeReturn,
    maxDrawdown: maxDrawdownPct,
    profitFactor,
    trades,
    equityCurve,
    returnDistribution,
    learnings: {
      dataShows,
      whatItMightMean,
      whatWeCanReasonablyConclude,
    },
  };
}
