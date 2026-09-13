'use client';

import React from 'react';
import { BacktestResult, Experiment } from '@/lib/types/research';
import { AlertTriangle, TrendingUp, Percent, Compass, Layers, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResultsSummaryProps {
  results: BacktestResult;
  experiment: Experiment;
}

export function ResultsSummary({ results, experiment }: ResultsSummaryProps) {
  const isPositiveEdge = results.estimatedEdge >= 0;
  const formatPct = (val: number) => (val >= 0 ? `+${val.toFixed(2)}%` : `${val.toFixed(2)}%`);

  return (
    <div className="space-y-4">
      {/* Demo Data Disclaimer */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-amber-300 uppercase tracking-wide text-xs block">
            DEMO DATA
          </span>
          <p className="text-amber-200/90 leading-relaxed font-sans text-xs">
            This prototype uses simulated market data. Results are illustrative and should not be treated as investment evidence.
          </p>
        </div>
      </div>

      {/* Main Results Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-zinc-850 px-5 py-3 border-b border-zinc-800 flex items-center justify-between">
          <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
            Experiment Result
          </span>
          <span className="text-xs font-mono text-zinc-400">
            {results.totalObservations} trading days evaluated
          </span>
        </div>

        {/* 5 Core Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-zinc-800 p-2">
          {/* Signals */}
          <div className="p-4 space-y-1">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span className="font-mono text-[10px] uppercase font-semibold">Signals</span>
              <Layers className="w-3.5 h-3.5" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white">
              {results.qualifyingSignals}
            </div>
            <div className="text-[11px] text-zinc-500">qualifying entries</div>
          </div>

          {/* Win Rate */}
          <div className="p-4 space-y-1">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span className="font-mono text-[10px] uppercase font-semibold">Win Rate</span>
              <Percent className="w-3.5 h-3.5" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white">
              {results.winRate.toFixed(1)}%
            </div>
            <div className="text-[11px] text-zinc-500">{results.winningTradesCount}W / {results.losingTradesCount}L</div>
          </div>

          {/* Avg Return */}
          <div className="p-4 space-y-1">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span className="font-mono text-[10px] uppercase font-semibold">Avg Return</span>
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <div className={cn('text-2xl sm:text-3xl font-bold font-mono', results.avgStrategyReturn >= 0 ? 'text-emerald-400' : 'text-rose-400')}>
              {formatPct(results.avgStrategyReturn)}
            </div>
            <div className="text-[11px] text-zinc-500">per {experiment.holdingPeriodDays}d trade</div>
          </div>

          {/* Baseline Return */}
          <div className="p-4 space-y-1">
            <div className="flex items-center justify-between text-zinc-400 text-xs">
              <span className="font-mono text-[10px] uppercase font-semibold">Baseline Return</span>
              <Compass className="w-3.5 h-3.5" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-zinc-300">
              {formatPct(results.unconditionalBaselineReturn)}
            </div>
            <div className="text-[11px] text-zinc-500">unconditional drift</div>
          </div>

          {/* Estimated Edge */}
          <div className={cn('p-4 space-y-1 col-span-2 sm:col-span-1 rounded-lg', isPositiveEdge ? 'bg-emerald-950/20' : 'bg-rose-950/20')}>
            <div className="flex items-center justify-between text-xs">
              <span className={cn('font-mono text-[10px] uppercase font-bold', isPositiveEdge ? 'text-emerald-400' : 'text-rose-400')}>
                Estimated Edge
              </span>
              {isPositiveEdge ? (
                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-rose-400" />
              )}
            </div>
            <div className={cn('text-2xl sm:text-3xl font-bold font-mono', isPositiveEdge ? 'text-emerald-400' : 'text-rose-400')}>
              {formatPct(results.estimatedEdge)}
            </div>
            <div className="text-[11px] text-zinc-400">excess return</div>
          </div>
        </div>

        {/* Secondary Diagnostics Table */}
        <div className="bg-zinc-950/80 px-5 py-3 border-t border-zinc-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div>
            <span className="text-zinc-500 text-[10px] uppercase block">Median Return</span>
            <span className="text-zinc-200 font-semibold">{formatPct(results.medianStrategyReturn)}</span>
          </div>
          <div>
            <span className="text-zinc-500 text-[10px] uppercase block">Max Drawdown</span>
            <span className="text-rose-400 font-semibold">-{results.maxDrawdown.toFixed(1)}%</span>
          </div>
          <div>
            <span className="text-zinc-500 text-[10px] uppercase block">Profit Factor</span>
            <span className="text-zinc-200 font-semibold">{results.profitFactor.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-zinc-500 text-[10px] uppercase block">Cumulative Return</span>
            <span className="text-emerald-400 font-semibold">{formatPct(results.strategyCumulativeReturn)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
