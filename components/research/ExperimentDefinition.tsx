'use client';

import React from 'react';
import { Experiment, ResearchQuestion, ClarificationChoices } from '@/lib/types/research';
import { Play, ArrowLeft } from 'lucide-react';
import { AssumptionsPanel } from './AssumptionsPanel';

interface ExperimentDefinitionProps {
  experiment: Experiment;
  parsedQuestion: ResearchQuestion;
  clarifications: ClarificationChoices;
  onRunExperiment: () => void;
  onEditAssumptions: () => void;
  onBackToClarify: () => void;
  isLoading: boolean;
}

export function ExperimentDefinition({
  experiment,
  parsedQuestion,
  clarifications,
  onRunExperiment,
  onEditAssumptions,
  onBackToClarify,
  isLoading,
}: ExperimentDefinitionProps) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
          Experiment Definition
        </h2>
        <p className="text-sm text-zinc-400 font-sans">
          Review the structured hypothesis and execution rules before running the test.
        </p>
      </div>

      {/* Side-by-side comparison: User's Question vs AI Interpretation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* User Question */}
        <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2 shadow-sm">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>User&apos;s Question</span>
          </div>
          <div className="text-sm text-white font-sans italic bg-zinc-950/80 p-3.5 rounded-lg border border-zinc-800 leading-relaxed">
            &ldquo;{experiment.question}&rdquo;
          </div>
        </div>

        {/* AI Interpretation */}
        <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2 shadow-sm">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-400"></span>
            <span>AI Interpretation</span>
          </div>
          <div className="text-sm text-sky-100 font-sans bg-zinc-950/80 p-3.5 rounded-lg border border-zinc-800 leading-relaxed">
            {experiment.aiInterpretation}
          </div>
        </div>
      </div>

      {/* Main Experiment Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-zinc-850 px-5 py-3.5 border-b border-zinc-800 flex items-center justify-between">
          <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
            Structured Experiment Specification
          </span>
          <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
            Ready to Run
          </span>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          {/* Formal Hypothesis */}
          <div className="bg-zinc-950/90 p-4 rounded-xl border border-zinc-800 space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold block">
              Hypothesis
            </span>
            <p className="text-sm sm:text-base text-zinc-100 font-sans font-medium leading-relaxed">
              &ldquo;{experiment.hypothesis}&rdquo;
            </p>
          </div>

          {/* Parameter Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800">
              <span className="text-zinc-500 text-[10px] uppercase block mb-0.5">Market</span>
              <span className="text-white font-bold text-sm font-sans">{experiment.instrument}</span>
            </div>

            <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800">
              <span className="text-zinc-500 text-[10px] uppercase block mb-0.5">Timeframe</span>
              <span className="text-white font-bold text-sm font-sans">{experiment.timeframe}</span>
            </div>

            <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800">
              <span className="text-zinc-500 text-[10px] uppercase block mb-0.5">Holding Period</span>
              <span className="text-white font-bold text-sm font-sans">{experiment.holdingPeriodDays} day(s)</span>
            </div>

            <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800">
              <span className="text-zinc-500 text-[10px] uppercase block mb-0.5">Test Period</span>
              <span className="text-white font-bold text-sm font-sans">{experiment.testPeriodYears} years</span>
            </div>

            <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800 sm:col-span-2">
              <span className="text-zinc-500 text-[10px] uppercase block mb-0.5">Entry Condition</span>
              <span className="text-emerald-400 font-bold text-sm font-sans">{experiment.entryCondition.description}</span>
            </div>

            <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800 sm:col-span-2">
              <span className="text-zinc-500 text-[10px] uppercase block mb-0.5">Exit Condition</span>
              <span className="text-white font-medium text-sm font-sans">{experiment.exitCondition.description}</span>
            </div>

            <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800 sm:col-span-2">
              <span className="text-zinc-500 text-[10px] uppercase block mb-0.5">Filters</span>
              <span className="text-zinc-200 text-sm font-sans">{experiment.volatilityFilterDescription || 'None'}</span>
            </div>

            <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800 sm:col-span-2">
              <span className="text-zinc-500 text-[10px] uppercase block mb-0.5">Cost Assumption</span>
              <span className="text-zinc-200 text-sm font-sans">{experiment.transactionCostBps} bps for prototype</span>
            </div>
          </div>

          {/* Assumptions */}
          <AssumptionsPanel
            parsedQuestion={parsedQuestion}
            clarifications={clarifications}
            onEditAssumptions={onEditAssumptions}
          />
        </div>

        {/* CTA Footer */}
        <div className="bg-zinc-850 px-5 py-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onBackToClarify}
            className="text-xs font-medium text-zinc-400 hover:text-zinc-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Clarify</span>
          </button>

          <button
            onClick={onRunExperiment}
            disabled={isLoading}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3 rounded-lg text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 transition-colors shadow-sm cursor-pointer"
          >
            <Play className="w-4 h-4 fill-zinc-950" />
            <span>Run Experiment</span>
          </button>
        </div>
      </div>
    </div>
  );
}
