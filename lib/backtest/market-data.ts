import { DailyMarketBar } from '@/lib/types/research';

// Simple seeded pseudo-random number generator (Mulberry32)
// Ensures 100% repeatable, deterministic market data across all runs
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateMockMarketData(seed: number = 42, years: number = 5): DailyMarketBar[] {
  const random = mulberry32(seed);
  const totalDays = Math.round(years * 252); // ~252 trading days per year
  const bars: DailyMarketBar[] = [];

  let currentPrice = 18000; // Starting NIFTY mock base
  const startDate = new Date(2019, 0, 2); // Jan 2, 2019

  // Helper for Gaussian/Normal distribution via Box-Muller transform
  const gaussianRandom = (mean: number, stdDev: number) => {
    const u = 1 - random();
    const v = random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return mean + z * stdDev;
  };

  const rawReturns: number[] = [];
  const dates: string[] = [];

  // Generate date sequence skipping weekends
  let d = new Date(startDate);
  while (dates.length < totalDays) {
    const dayOfWeek = d.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      dates.push(d.toISOString().split('T')[0]);
    }
    d.setDate(d.getDate() + 1);
  }

  // Pre-generate returns with regime switching to simulate realistic volatility clustering
  let inHighVolRegime = false;
  for (let i = 0; i < totalDays; i++) {
    // Regime switch probability
    if (random() < 0.04) {
      inHighVolRegime = !inHighVolRegime;
    }

    const vol = inHighVolRegime ? 0.022 : 0.009; // Daily std dev (high vol ~35% annualized, normal ~14%)
    const drift = 0.00035; // ~9% annualized drift

    let ret = gaussianRandom(drift, vol);

    // Inject occasional fat-tail events (e.g. sharp market shocks or rebounds)
    if (random() < 0.035) {
      ret = inHighVolRegime ? -gaussianRandom(0.022, 0.008) : -gaussianRandom(0.015, 0.005);
    }

    rawReturns.push(ret);
  }

  // Calculate prices and rolling 20-day annualized volatility
  const rollingVolatilities: number[] = [];
  for (let i = 0; i < totalDays; i++) {
    if (i < 20) {
      rollingVolatilities.push(0.16); // Default baseline vol
    } else {
      const window = rawReturns.slice(i - 20, i);
      const mean = window.reduce((a, b) => a + b, 0) / 20;
      const variance = window.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / 19;
      const annualizedVol = Math.sqrt(variance) * Math.sqrt(252);
      rollingVolatilities.push(annualizedVol);
    }
  }

  // Calculate percentiles of volatility across the entire series
  const sortedVols = [...rollingVolatilities].sort((a, b) => a - b);

  for (let i = 0; i < totalDays; i++) {
    const ret = rawReturns[i];
    const prevClose = currentPrice;
    currentPrice = Math.max(1000, currentPrice * (1 + ret));

    // Daily High/Low simulation based on volatility
    const dayRangePct = Math.max(Math.abs(ret), 0.006) * (1 + random() * 0.8);
    const high = Math.max(prevClose, currentPrice) * (1 + dayRangePct * 0.4);
    const low = Math.min(prevClose, currentPrice) * (1 - dayRangePct * 0.4);
    const open = prevClose * (1 + (random() - 0.5) * 0.004);
    const volume = Math.round(150000000 + random() * 100000000);

    const vol = rollingVolatilities[i];
    // Find percentile rank
    const rankIndex = sortedVols.findIndex((v) => v >= vol);
    const percentile = rankIndex === -1 ? 1 : rankIndex / sortedVols.length;

    bars.push({
      date: dates[i],
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(currentPrice * 100) / 100,
      returnPct: ret,
      volume,
      volatility20d: Math.round(vol * 10000) / 10000,
      volatilityPercentile: Math.round(percentile * 100) / 100,
    });
  }

  return bars;
}
