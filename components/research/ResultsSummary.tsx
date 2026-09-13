'use client';

import React from 'react';
import { BacktestResult, Experiment } from '@/lib/types/research';
import {
  TrendingUp,
  Percent,
  Compass,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResultsSummaryProps {
  results: BacktestResult;
  experiment: Experiment;
}

export function ResultsSummary({ results, experiment }: ResultsSummaryProps) {
  const isPositiveEdge = results.estimatedEdge >= 0;
  const formatPct = (val: number) => (val >= 0 ? `+${val.toFixed(2)}%` : `${val.toFixed(2)}%`);

  return (
    <div className="space-y-5">
      {/* Mandatory Demo Data Banner */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-mono flex items-start gap-3 shadow-lg">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold tracking-widest text-amber-300 uppercase block text-[11px]">
            DEMO DATA // SCIENTIFIC RESEARCH DISCLAIMER
          </span>
          <p className="text-amber-200/90 text-xs font-sans leading-relaxed">
            This prototype operates on simulated market data generated via seeded pseudo-random
            processes. Results are illustrative for testing the research framework and must not be
            treated as real historical exchange evidence or financial advice.
          </p>
        </div>
      </div>

      {/* Primary Key Performance Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Signals */}
        <div className="p-4 rounded-xl card-terminal space-y-1.5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span className="text-[10px] uppercase font-bold tracking-wider">SIGNALS</span>
            <Layers className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
            {results.qualifyingSignals}
          </div>
          <div className="text-[11px] text-slate-400 font-sans">
            out of {results.totalObservations} sessions
          </div>
        </div>

        {/* Win Rate */}
        <div className="p-4 rounded-xl card-terminal space-y-1.5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span className="text-[10px] uppercase font-bold tracking-wider">WIN RATE</span>
            <Percent className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400 tracking-tight">
            {results.winRate.toFixed(1)}%
          </div>
          <div className="text-[11px] text-slate-400 font-sans">
            {results.winningTradesCount} wins / {results.losingTradesCount} losses
          </div>
        </div>

        {/* Average Return */}
        <div className="p-4 rounded-xl card-terminal space-y-1.5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span className="text-[10px] uppercase font-bold tracking-wider">AVG RETURN</span>
            <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div
            className={cn(
              'text-2xl sm:text-3xl font-extrabold font-mono tracking-tight',
              results.avgStrategyReturn >= 0 ? 'text-emerald-400' : 'text-rose-400'
            )}
          >
            {formatPct(results.avgStrategyReturn)}
          </div>
          <div className="text-[11px] text-slate-400 font-sans">
            per {experiment.holdingPeriodDays}-day hold
          </div>
        </div>

        {/* Baseline Return */}
        <div className="p-4 rounded-xl card-terminal space-y-1.5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span className="text-[10px] uppercase font-bold tracking-wider">BASELINE RETURN</span>
            <Compass className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-300 tracking-tight">
            {formatPct(results.unconditionalBaselineReturn)}
          </div>
          <div className="text-[11px] text-slate-400 font-sans">unconditional market drift</div>
        </div>

        {/* Estimated Edge */}
        <div
          className={cn(
            'p-4 rounded-xl border space-y-1.5 col-span-2 sm:col-span-1 shadow-xl',
            isPositiveEdge
              ? 'bg-emerald-950/30 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.18)]'
              : 'bg-rose-950/30 border-rose-500/50'
          )}
        >
          <div className="flex items-center justify-between text-xs font-mono">
            <span className={isPositiveEdge ? 'text-emerald-300 font-bold text-[10px] tracking-wider' : 'text-rose-300 font-bold text-[10px] tracking-wider'}>
              ESTIMATED EDGE
            </span>
            {isPositiveEdge ? (
              <ArrowUpRight className="w-4 h-4 text-emerald-400" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-rose-400" />
            )}
          </div>
          <div
            className={cn(
              'text-2xl sm:text-3xl font-extrabold font-mono tracking-tight',
              isPositiveEdge ? 'text-emerald-400' : 'text-rose-400'
            )}
          >
            {formatPct(results.estimatedEdge)}
          </div>
          <div className="text-[11px] text-slate-300 font-sans font-medium">
            Strategy vs Unconditional
          </div>
        </div>
      </div>

      {/* Secondary Terminal Metric Table */}
      <div className="card-terminal rounded-xl overflow-hidden text-xs font-mono shadow-xl">
        <div className="bg-slate-900/90 px-4 py-3 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-200 font-bold uppercase tracking-wider text-[11px]">
              Detailed Statistical Diagnostics
            </span>
          </div>
          <span className="text-slate-400 text-[10px] font-mono">NIFTY 50 SIMULATOR</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/[0.08] p-3.5">
          <div className="p-2.5 space-y-1">
            <span className="text-slate-400 uppercase text-[10px] tracking-wider">Median Trade Return</span>
            <div className="text-slate-100 font-bold text-sm">
              {formatPct(results.medianStrategyReturn)}
            </div>
          </div>
          <div className="p-2.5 space-y-1">
            <span className="text-slate-400 uppercase text-[10px] tracking-wider">Profit Factor</span>
            <div className="text-slate-100 font-bold text-sm font-mono">
              {results.profitFactor.toFixed(2)}
            </div>
          </div>
          <div className="p-2.5 space-y-1">
            <span className="text-slate-400 uppercase text-[10px] tracking-wider">Maximum Drawdown</span>
            <div className="text-rose-400 font-bold text-sm font-mono">
              -{results.maxDrawdown.toFixed(1)}%
            </div>
          </div>
          <div className="p-2.5 space-y-1">
            <span className="text-slate-400 uppercase text-[10px] tracking-wider">Strategy Cumulative</span>
            <div className="text-emerald-400 font-bold text-sm font-mono">
              {formatPct(results.strategyCumulativeReturn)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
