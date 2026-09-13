'use client';

import React from 'react';
import { Experiment, ResearchQuestion, ClarificationChoices } from '@/lib/types/research';
import { cn } from '@/lib/utils';

interface ExperimentContextPanelProps {
  question: string;
  parsedQuestion: ResearchQuestion | null;
  clarifications: ClarificationChoices;
  experiment: Experiment | null;
  className?: string;
}

export function ExperimentContextPanel({
  question,
  parsedQuestion,
  clarifications,
  experiment,
  className,
}: ExperimentContextPanelProps) {
  if (!question) {
    return (
      <aside
        className={cn(
          'w-full lg:w-72 bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-xs text-zinc-500 shadow-sm',
          className
        )}
      >
        <div className="font-bold text-zinc-300 mb-2 uppercase text-[11px] font-mono tracking-wider">
          Experiment Context
        </div>
        <p className="italic text-zinc-500">Context will appear once an experiment is created.</p>
      </aside>
    );
  }

  const getSourceBadge = (source?: 'explicit' | 'inferred' | 'assumed' | 'missing') => {
    switch (source) {
      case 'explicit':
        return (
          <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800 text-[9px] font-mono uppercase font-semibold">
            User Said
          </span>
        );
      case 'inferred':
        return (
          <span className="px-1.5 py-0.5 rounded bg-sky-950/80 text-sky-300 border border-sky-800 text-[9px] font-mono uppercase font-semibold">
            Inferred
          </span>
        );
      case 'missing':
        return (
          <span className="px-1.5 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-800 text-[9px] font-mono uppercase font-semibold">
            Missing
          </span>
        );
      case 'assumed':
      default:
        return (
          <span className="px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800 text-[9px] font-mono uppercase font-semibold">
            Assumed
          </span>
        );
    }
  };

  return (
    <aside
      className={cn(
        'w-full lg:w-72 bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-xs flex flex-col gap-3 font-sans shadow-sm',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5 font-mono">
        <span className="text-[11px] font-bold text-zinc-200 uppercase tracking-wider">
          Experiment Context
        </span>
        <span className="text-[10px] text-zinc-400 uppercase font-semibold px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700">
          {experiment?.status || 'Draft'}
        </span>
      </div>

      {/* Question */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-mono uppercase font-semibold text-zinc-400">Question</span>
        <div className="text-zinc-200 text-xs italic bg-zinc-950/80 p-2.5 rounded-lg border border-zinc-800 leading-relaxed font-sans">
          &ldquo;{question}&rdquo;
        </div>
      </div>

      {/* Parameters */}
      <div className="space-y-2.5 divide-y divide-zinc-800 text-xs">
        <div className="pt-2 flex items-center justify-between">
          <span className="text-zinc-400">Market</span>
          <div className="flex items-center gap-1.5">
            <span className="text-white font-medium">
              {experiment?.instrument || parsedQuestion?.instrument || 'NIFTY 50'}
            </span>
            {getSourceBadge(parsedQuestion?.parameterSources?.instrument)}
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <span className="text-zinc-400">Entry</span>
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-400 font-mono font-medium">
              ≥ {clarifications.entryThresholdPct}% fall
            </span>
            {getSourceBadge(parsedQuestion?.parameterSources?.entryThreshold)}
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <span className="text-zinc-400">Exit</span>
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-200">
              Close Day {clarifications.holdingPeriodDays}
            </span>
            {getSourceBadge('assumed')}
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <span className="text-zinc-400">Holding Period</span>
          <div className="flex items-center gap-1.5">
            <span className="text-white font-mono font-medium">
              {clarifications.holdingPeriodDays}d
            </span>
            {getSourceBadge(parsedQuestion?.parameterSources?.holdingPeriod)}
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <span className="text-zinc-400">Regime Filter</span>
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-300">
              {clarifications.volatilityRegime === 'high_volatility'
                ? 'High Vol'
                : clarifications.volatilityRegime === 'low_volatility'
                ? 'Low Vol'
                : 'All'}
            </span>
            {getSourceBadge(parsedQuestion?.parameterSources?.volatilityFilter)}
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <span className="text-zinc-400">Cost</span>
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-300 font-mono">
              {clarifications.costBps === 0 ? '0 bps' : `${clarifications.costBps} bps`}
            </span>
            {getSourceBadge('assumed')}
          </div>
        </div>
      </div>
    </aside>
  );
}
