'use client';

import React from 'react';
import { Experiment, ResearchQuestion, ClarificationChoices } from '@/lib/types/research';
import { Play, Sparkles, FlaskConical, ArrowLeft, Layers, SlidersHorizontal, ArrowRight } from 'lucide-react';
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
      {/* Stage Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium">
          <FlaskConical className="w-3.5 h-3.5 text-cyan-400" />
          <span>STAGE 03 // FORMAL EXPERIMENT SPECIFICATION</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">
          Experiment Definition
        </h2>
        <p className="text-sm text-slate-400 font-sans leading-relaxed">
          The natural language inquiry has been translated into a reproducible quantitative
          specification with testable hypothesis and boundary conditions.
        </p>
      </div>

      {/* Side-by-side comparison: User's Question vs AI Interpretation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* User Question */}
        <div className="p-5 rounded-xl card-terminal space-y-2.5">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-mono uppercase tracking-wider font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            <span>User&apos;s Original Question</span>
          </div>
          <div className="text-sm text-slate-200 font-medium font-sans italic bg-slate-950/70 p-3.5 rounded-lg border border-white/[0.06] leading-relaxed shadow-inner">
            &ldquo;{experiment.question}&rdquo;
          </div>
        </div>

        {/* AI Interpretation */}
        <div className="p-5 rounded-xl card-terminal space-y-2.5 border-cyan-500/30">
          <div className="flex items-center gap-2 text-cyan-300 text-xs font-mono uppercase tracking-wider font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Mathematical Interpretation</span>
          </div>
          <div className="text-sm text-cyan-100 font-sans bg-cyan-950/30 p-3.5 rounded-lg border border-cyan-500/20 leading-relaxed shadow-inner">
            {experiment.aiInterpretation}
          </div>
        </div>
      </div>

      {/* Structured Experiment Card */}
      <div className="card-terminal rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-slate-900/90 px-6 py-3.5 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-200 font-mono text-xs font-bold uppercase tracking-wider">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Formal Experiment Specification</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-mono text-[10px] uppercase font-bold tracking-wider">
            Ready to Execute
          </span>
        </div>

        <div className="p-6 sm:p-7 space-y-6">
          {/* Formal Hypothesis */}
          <div className="space-y-2 bg-emerald-950/30 p-4 rounded-xl border border-emerald-500/30 shadow-sm">
            <span className="text-[11px] font-mono text-emerald-300 uppercase tracking-widest font-bold block">
              Quantitative Hypothesis (H₁)
            </span>
            <p className="text-sm sm:text-base text-slate-100 font-sans font-medium leading-relaxed">
              &ldquo;{experiment.hypothesis}&rdquo;
            </p>
          </div>

          {/* Grid of Parameters */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 font-mono text-xs">
            <div className="p-3.5 rounded-xl card-terminal-subtle">
              <span className="text-slate-400 text-[10px] uppercase tracking-wider block mb-1">Market Index</span>
              <span className="text-slate-100 font-bold text-sm font-sans">
                {experiment.instrument}
              </span>
            </div>

            <div className="p-3.5 rounded-xl card-terminal-subtle">
              <span className="text-slate-400 text-[10px] uppercase tracking-wider block mb-1">Timeframe</span>
              <span className="text-slate-100 font-bold text-sm font-sans">
                {experiment.timeframe} (Close-to-Close)
              </span>
            </div>

            <div className="p-3.5 rounded-xl card-terminal-subtle">
              <span className="text-slate-400 text-[10px] uppercase tracking-wider block mb-1">Entry Trigger</span>
              <span className="text-emerald-400 font-bold text-sm">
                {experiment.entryCondition.description}
              </span>
            </div>

            <div className="p-3.5 rounded-xl card-terminal-subtle">
              <span className="text-slate-400 text-[10px] uppercase tracking-wider block mb-1">Holding Horizon</span>
              <span className="text-slate-100 font-bold text-sm">
                {experiment.holdingPeriodDays} trading day
                {experiment.holdingPeriodDays > 1 ? 's' : ''}
              </span>
            </div>

            <div className="p-3.5 rounded-xl card-terminal-subtle">
              <span className="text-slate-400 text-[10px] uppercase tracking-wider block mb-1">Exit Rule</span>
              <span className="text-slate-100 font-semibold text-sm">
                {experiment.exitCondition.description}
              </span>
            </div>

            <div className="p-3.5 rounded-xl card-terminal-subtle">
              <span className="text-slate-400 text-[10px] uppercase tracking-wider block mb-1">Test Window</span>
              <span className="text-slate-100 font-semibold text-sm">
                {experiment.testPeriodYears} Years (~{experiment.testPeriodYears * 252} bars)
              </span>
            </div>

            <div className="p-3.5 rounded-xl card-terminal-subtle">
              <span className="text-slate-400 text-[10px] uppercase tracking-wider block mb-1">Regime Filters</span>
              <span className="text-purple-300 font-bold text-sm">
                {experiment.volatilityFilterDescription || 'All Market Regimes'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl card-terminal-subtle">
              <span className="text-slate-400 text-[10px] uppercase tracking-wider block mb-1">Execution Drag</span>
              <span className="text-slate-100 font-semibold text-sm">
                {experiment.transactionCostBps} bps round-trip
              </span>
            </div>

            <div className="p-3.5 rounded-xl card-terminal-subtle">
              <span className="text-slate-400 text-[10px] uppercase tracking-wider block mb-1">Backtest Mode</span>
              <span className="text-cyan-300 font-bold text-sm font-sans">
                Deterministic Simulator
              </span>
            </div>
          </div>

          {/* Transparent Assumptions Callout */}
          <AssumptionsPanel
            parsedQuestion={parsedQuestion}
            clarifications={clarifications}
            onEditAssumptions={onEditAssumptions}
          />
        </div>

        {/* CTA Footer */}
        <div className="bg-slate-900/90 px-6 py-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={onBackToClarify}
            className="text-xs text-slate-400 hover:text-slate-200 font-mono transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Clarifications</span>
          </button>

          <button
            onClick={onRunExperiment}
            disabled={isLoading}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3 rounded-xl font-mono font-bold text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_24px_rgba(16,185,129,0.45)] transition-all cursor-pointer hover:translate-y-[-1px]"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Run Experiment</span>
          </button>
        </div>
      </div>
    </div>
  );
}
