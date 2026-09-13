'use client';

import React from 'react';
import { ClarificationChoices, ResearchQuestion } from '@/lib/types/research';
import { ShieldCheck } from 'lucide-react';

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
      value: `Close of trading day ${clarifications.holdingPeriodDays}`,
      source: parsedQuestion.parameterSources.exitCondition,
    },
    {
      label: 'Test period',
      value: `${clarifications.testPeriodYears} years`,
      source: 'assumed',
    },
    {
      label: 'Transaction costs',
      value:
        clarifications.costBps === 0
          ? 'Excluded for prototype (0 bps)'
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
          : 'None (All market periods)',
      source: parsedQuestion.parameterSources.volatilityFilter,
    },
  ];

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-white uppercase text-xs tracking-wider font-mono">
              Assumptions
            </span>
          </div>
          <span className="text-zinc-400 text-xs mt-0.5 block font-sans">
            These were not explicitly specified in your question.
          </span>
        </div>
        <button
          onClick={onEditAssumptions}
          className="px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-zinc-700 transition-colors text-xs font-medium cursor-pointer self-start sm:self-center"
        >
          Change assumptions
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {assumptionsList.map((item, idx) => (
          <div
            key={idx}
            className="flex items-start justify-between p-3 rounded-lg bg-zinc-950/60 border border-zinc-800"
          >
            <div>
              <span className="text-zinc-500 text-[10px] block font-mono uppercase tracking-wider">
                {item.label}
              </span>
              <span className="text-zinc-200 font-medium text-xs font-sans mt-0.5 block">
                {item.value}
              </span>
            </div>
            <span
              className={`text-[9px] px-2 py-0.5 rounded font-mono uppercase font-bold tracking-wider ${
                item.source === 'explicit'
                  ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                  : item.source === 'inferred'
                  ? 'bg-sky-950/80 text-sky-400 border border-sky-800'
                  : 'bg-amber-950/80 text-amber-300 border border-amber-800'
              }`}
            >
              {item.source === 'explicit'
                ? 'User Specified'
                : item.source === 'inferred'
                ? 'Inferred'
                : 'Assumed'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
