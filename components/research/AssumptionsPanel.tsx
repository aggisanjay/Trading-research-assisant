'use client';

import React from 'react';
import { ClarificationChoices, ResearchQuestion } from '@/lib/types/research';
import { ShieldCheck, Edit3 } from 'lucide-react';

interface AssumptionsPanelProps {
  parsedQuestion: ResearchQuestion;
  clarifications: ClarificationChoices;
  onEditAssumptions: () => void;
}

export function AssumptionsPanel({
  parsedQuestion,
  clarifications,
  onEditAssumptions,
}: AssumptionsPanelProps) {
  const assumptionsList = [
    {
      label: 'Sharp fall definition',
      value: `Daily NIFTY decline ≥ ${clarifications.entryThresholdPct}%`,
      source: parsedQuestion.parameterSources.entryThreshold,
    },
    {
      label: 'Holding period',
      value: `${clarifications.holdingPeriodDays} trading day${
        clarifications.holdingPeriodDays > 1 ? 's' : ''
      }`,
      source: parsedQuestion.parameterSources.holdingPeriod,
    },
    {
      label: 'Exit execution',
      value: `Close of Day ${clarifications.holdingPeriodDays}`,
      source: parsedQuestion.parameterSources.exitCondition,
    },
    {
      label: 'Sample period',
      value: `${clarifications.testPeriodYears} years (~${clarifications.testPeriodYears * 252} bars)`,
      source: 'assumed',
    },
    {
      label: 'Transaction costs',
      value:
        clarifications.costBps === 0
          ? '0 bps (Excluded for prototype)'
          : `${clarifications.costBps} bps per trade`,
      source: 'assumed',
    },
    {
      label: 'Volatility regime',
      value:
        clarifications.volatilityRegime === 'high_volatility'
          ? 'Rolling 20-day volatility ≥ 75th percentile'
          : clarifications.volatilityRegime === 'low_volatility'
          ? 'Rolling 20-day volatility ≤ 25th percentile'
          : 'All historical market regimes',
      source: parsedQuestion.parameterSources.volatilityFilter,
    },
  ];

  return (
    <div className="card-terminal border-amber-500/30 rounded-xl p-5 space-y-3.5 font-mono text-xs shadow-xl">
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-2 text-amber-300 font-bold uppercase tracking-wider text-xs">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Active Assumptions &amp; Provenance</span>
        </div>
        <button
          onClick={onEditAssumptions}
          className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white border border-white/[0.1] transition-all text-[11px] font-medium"
        >
          <Edit3 className="w-3 h-3 text-slate-400" />
          <span>Change Assumptions</span>
        </button>
      </div>

      <p className="text-slate-400 text-xs font-sans leading-relaxed">
        Responsible quantitative modeling requires making every latent parameter visible. The
        following assumptions are applied to structure the experiment:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
        {assumptionsList.map((item, idx) => (
          <div
            key={idx}
            className="flex items-start justify-between p-3 rounded-lg card-terminal-subtle"
          >
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-mono tracking-wider block mb-0.5">
                {item.label}
              </span>
              <span className="text-slate-100 font-semibold text-xs font-mono">{item.value}</span>
            </div>
            <span
              className={`text-[9px] px-2 py-0.5 rounded font-mono uppercase tracking-wider font-semibold ${
                item.source === 'explicit'
                  ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                  : item.source === 'inferred'
                  ? 'bg-sky-950/80 text-sky-300 border border-sky-500/40'
                  : 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
              }`}
            >
              {item.source === 'explicit'
                ? 'User Specified'
                : item.source === 'inferred'
                ? 'AI Inferred'
                : 'Assumed'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
