'use client';

import React from 'react';
import { BacktestResult, Experiment } from '@/lib/types/research';

interface LearnSectionProps {
  results: BacktestResult;
  experiment: Experiment;
}

export function LearnSection({ results, experiment }: LearnSectionProps) {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {/* Title */}
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
          Findings &amp; Interpretation
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 font-sans">
          Clearly separating observed historical data from AI interpretation and realistic conclusions.
        </p>
      </div>

      <div className="space-y-3.5 text-xs">
        {/* SECTION 1: WHAT THE DATA SHOWS */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/60">
              1. What the Data Shows
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase">
              Observed Evidence
            </span>
          </div>
          <p className="text-zinc-200 text-sm leading-relaxed font-sans pt-1">
            {results.learnings.dataShows}
          </p>
          <div className="text-[11px] text-zinc-400 font-mono border-t border-zinc-800/80 pt-2 mt-2">
            Raw observational data from the simulated trade log.
          </div>
        </div>

        {/* SECTION 2: WHAT THIS MIGHT MEAN */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-sky-400 font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-950/60 border border-sky-800/60">
              2. What This Might Mean
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase">
              AI Hypothesis Assessment
            </span>
          </div>
          <p className="text-zinc-200 text-sm leading-relaxed font-sans pt-1">
            {results.learnings.whatItMightMean}
          </p>
          <div className="text-[11px] text-zinc-400 font-mono border-t border-zinc-800/80 pt-2 mt-2">
            Plausible economic explanation for the empirical pattern.
          </div>
        </div>

        {/* SECTION 3: WHAT WE CAN REASONABLY CONCLUDE */}
        <div className="bg-zinc-900 border border-amber-500/30 rounded-xl p-5 space-y-2 shadow-sm bg-gradient-to-b from-amber-950/10 to-transparent">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-amber-300 font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-950/80 border border-amber-800/80">
              3. What We Can Reasonably Conclude
            </span>
            <span className="text-[10px] font-mono text-amber-400/80 uppercase">
              Prudent Guidance
            </span>
          </div>
          <p className="text-amber-100 text-sm leading-relaxed font-sans font-medium pt-1">
            {results.learnings.whatWeCanReasonablyConclude}
          </p>
          <div className="text-[11px] text-amber-400/90 font-mono border-t border-amber-800/40 pt-2 mt-2">
            Critical caveat: This is an interpretation, not proof of an investable edge.
          </div>
        </div>
      </div>
    </div>
  );
}
