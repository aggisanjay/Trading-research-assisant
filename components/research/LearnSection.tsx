'use client';

import React from 'react';
import { BacktestResult, Experiment } from '@/lib/types/research';
import { Database, Lightbulb, Scale, ShieldAlert, Sparkles } from 'lucide-react';

interface LearnSectionProps {
  results: BacktestResult;
  experiment: Experiment;
}

export function LearnSection({ results, experiment }: LearnSectionProps) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Section Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-medium">
          <Scale className="w-3.5 h-3.5 text-emerald-400" />
          <span>STAGE 05 // EVIDENCE SYNTHESIS &amp; REASONING</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">
          Separating Empirical Data from Interpretation
        </h2>
        <p className="text-sm text-slate-400 font-sans leading-relaxed">
          Serious quantitative research requires disciplined epistemics: distinguishing strictly
          between observed statistical facts, tentative hypotheses, and prudent operational
          conclusions.
        </p>
      </div>

      {/* The 3 Separated Pillars */}
      <div className="space-y-4">
        {/* PILLAR 1: What the data shows */}
        <div className="card-terminal rounded-2xl p-6 space-y-2.5 border-emerald-500/30 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase font-bold tracking-wider">
              <Database className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>01 // WHAT THE DATA SHOWS (EMPIRICAL FACTS)</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono uppercase font-bold">
              Descriptive Statistics
            </span>
          </div>
          <p className="text-sm sm:text-base text-slate-100 font-sans leading-relaxed">
            {results.learnings.dataShows}
          </p>
          <div className="text-[11px] text-slate-400 font-mono pt-1">
            Status: Non-interpretative trade logs derived directly from deterministic simulation.
          </div>
        </div>

        {/* PILLAR 2: What this might mean */}
        <div className="card-terminal rounded-2xl p-6 space-y-2.5 border-sky-500/30 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sky-300 font-mono text-xs uppercase font-bold tracking-wider">
              <Lightbulb className="w-4 h-4 text-sky-400 shrink-0" />
              <span>02 // WHAT THIS MIGHT MEAN (HYPOTHESIS ASSESSMENT)</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-sky-950/80 text-sky-300 border border-sky-500/30 text-[9px] font-mono uppercase font-bold">
              Theoretical Hypothesis
            </span>
          </div>
          <p className="text-sm sm:text-base text-slate-100 font-sans leading-relaxed">
            {results.learnings.whatItMightMean}
          </p>
          <div className="text-[11px] text-slate-400 font-mono pt-1">
            Status: Theoretical inference regarding short-term supply/demand inelasticity and mean reversion.
          </div>
        </div>

        {/* PILLAR 3: What we can reasonably conclude */}
        <div className="card-terminal rounded-2xl p-6 space-y-2.5 border-amber-500/50 shadow-xl bg-gradient-to-b from-[#151722]/90 to-[#0d101a]/90">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-300 font-mono text-xs uppercase font-bold tracking-wider">
              <Scale className="w-4 h-4 text-amber-400 shrink-0" />
              <span>03 // WHAT WE CAN REASONABLY CONCLUDE (CRITICAL CAVEATS)</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/30 text-[9px] font-mono uppercase font-bold">
              Prudent Conclusion
            </span>
          </div>
          <p className="text-sm sm:text-base text-amber-100 font-sans leading-relaxed font-semibold">
            {results.learnings.whatWeCanReasonablyConclude}
          </p>
          <div className="text-[11px] text-amber-200/80 font-mono pt-1">
            Status: Non-conclusive verdict. Empirical correlation does NOT equal investable alpha.
          </div>
        </div>
      </div>
    </div>
  );
}
