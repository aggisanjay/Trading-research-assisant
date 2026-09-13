'use client';

import React from 'react';
import { Experiment, ResearchQuestion, ClarificationChoices } from '@/lib/types/research';
import { Layers, ShieldCheck, Cpu } from 'lucide-react';
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
          'w-full lg:w-80 card-terminal rounded-xl p-4 font-mono text-xs text-slate-500 shadow-xl',
          className
        )}
      >
        <div className="flex items-center gap-2 text-slate-300 font-semibold mb-3 border-b border-white/[0.08] pb-2 text-xs tracking-wider">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <span>EXPERIMENT CONTEXT</span>
        </div>
        <p className="text-slate-500 text-xs italic font-sans leading-relaxed">
          Parameter context and provenance tracking will initialize when a research question is analyzed.
        </p>
      </aside>
    );
  }

  const getSourceBadge = (source?: 'explicit' | 'inferred' | 'assumed' | 'missing') => {
    switch (source) {
      case 'explicit':
        return (
          <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 text-[9px] font-mono uppercase tracking-wider font-medium">
            User Said
          </span>
        );
      case 'inferred':
        return (
          <span className="px-1.5 py-0.5 rounded bg-sky-950/80 text-sky-300 border border-sky-500/40 text-[9px] font-mono uppercase tracking-wider font-medium">
            AI Inferred
          </span>
        );
      case 'missing':
        return (
          <span className="px-1.5 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-500/40 text-[9px] font-mono uppercase tracking-wider font-medium">
            Missing
          </span>
        );
      case 'assumed':
      default:
        return (
          <span className="px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/40 text-[9px] font-mono uppercase tracking-wider font-medium">
            Assumed
          </span>
        );
    }
  };

  return (
    <aside
      className={cn(
        'w-full lg:w-80 card-terminal rounded-xl p-4 font-mono text-xs flex flex-col gap-3.5 shadow-2xl',
        className
      )}
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
        <div className="flex items-center gap-2 text-slate-200 font-semibold tracking-wider text-[11px]">
          <Cpu className="w-3.5 h-3.5 text-emerald-400" />
          <span>EXPERIMENT CONTEXT</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900/80 border border-white/[0.06]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.8)]"></span>
          <span className="text-[10px] text-slate-300 font-mono uppercase tracking-wider">
            {experiment?.status || 'Drafting'}
          </span>
        </div>
      </div>

      {/* Raw Question */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] uppercase text-slate-400 font-semibold tracking-widest">
          Target Question
        </span>
        <div className="text-slate-200 bg-slate-950/70 p-2.5 rounded-lg border border-white/[0.06] text-xs font-sans italic leading-relaxed shadow-inner">
          &ldquo;{question}&rdquo;
        </div>
      </div>

      {/* Structured Parameters */}
      <div className="flex flex-col gap-2.5 divide-y divide-white/[0.06]">
        {/* Market */}
        <div className="pt-2 flex items-center justify-between">
          <span className="text-slate-400 font-sans text-xs">Market</span>
          <div className="flex items-center gap-2">
            <span className="text-slate-100 font-semibold font-sans">
              {experiment?.instrument || parsedQuestion?.instrument || 'NIFTY 50'}
            </span>
            {getSourceBadge(parsedQuestion?.parameterSources?.instrument)}
          </div>
        </div>

        {/* Timeframe */}
        <div className="pt-2 flex items-center justify-between">
          <span className="text-slate-400 font-sans text-xs">Timeframe</span>
          <div className="flex items-center gap-2">
            <span className="text-slate-200 font-medium font-sans">Daily (EOD)</span>
            {getSourceBadge('inferred')}
          </div>
        </div>

        {/* Entry Threshold */}
        <div className="pt-2 flex items-center justify-between">
          <span className="text-slate-400 font-sans text-xs">Entry Condition</span>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold font-mono">
              ≥ {clarifications.entryThresholdPct}% fall
            </span>
            {getSourceBadge(parsedQuestion?.parameterSources?.entryThreshold)}
          </div>
        </div>

        {/* Holding Period */}
        <div className="pt-2 flex items-center justify-between">
          <span className="text-slate-400 font-sans text-xs">Holding Horizon</span>
          <div className="flex items-center gap-2">
            <span className="text-slate-100 font-mono font-medium">
              {clarifications.holdingPeriodDays} day
              {clarifications.holdingPeriodDays > 1 ? 's' : ''}
            </span>
            {getSourceBadge(parsedQuestion?.parameterSources?.holdingPeriod)}
          </div>
        </div>

        {/* Exit Condition */}
        <div className="pt-2 flex items-center justify-between">
          <span className="text-slate-400 font-sans text-xs">Exit Rule</span>
          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-sans">
              {clarifications.exitRule === 'holding_period'
                ? `Day ${clarifications.holdingPeriodDays} Close`
                : 'Custom Trailing'}
            </span>
            {getSourceBadge('assumed')}
          </div>
        </div>

        {/* Volatility Regime */}
        <div className="pt-2 flex items-center justify-between">
          <span className="text-slate-400 font-sans text-xs">Regime Filter</span>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'text-xs font-mono',
                clarifications.volatilityRegime === 'high_volatility'
                  ? 'text-purple-300 font-semibold'
                  : 'text-slate-300'
              )}
            >
              {clarifications.volatilityRegime === 'high_volatility'
                ? 'High Vol (≥75%)'
                : clarifications.volatilityRegime === 'low_volatility'
                ? 'Low Vol (≤25%)'
                : 'All Regimes'}
            </span>
            {getSourceBadge(parsedQuestion?.parameterSources?.volatilityFilter)}
          </div>
        </div>

        {/* Cost Assumption */}
        <div className="pt-2 flex items-center justify-between">
          <span className="text-slate-400 font-sans text-xs">Friction</span>
          <div className="flex items-center gap-2">
            <span className="text-slate-300 font-mono">
              {clarifications.costBps === 0 ? '0 bps (Demo)' : `${clarifications.costBps} bps`}
            </span>
            {getSourceBadge('assumed')}
          </div>
        </div>
      </div>

      {/* Provenance Explainer */}
      <div className="mt-auto card-terminal-subtle p-3 rounded-lg text-[10px] text-slate-400 space-y-1">
        <div className="flex items-center gap-1.5 text-slate-300 font-semibold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Research Provenance</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-400 font-sans">
          Every parameter is tagged explicitly by source so unstated defaults are never confused with user instructions.
        </p>
      </div>
    </aside>
  );
}
