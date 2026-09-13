'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Experiment, BacktestResult } from '@/lib/types/research';

interface NextQuestionsProps {
  experiment: Experiment;
  results: BacktestResult;
  onSelectQuestion: (question: string) => void;
}

export function NextQuestions({
  experiment,
  results,
  onSelectQuestion,
}: NextQuestionsProps) {
  const questions = [
    {
      query: 'Does buying NIFTY after a 1% fall work better during high-volatility periods?',
      label: 'Volatility regime test',
    },
    {
      query: 'Does buying after a 2% fall produce a stronger signal?',
      label: 'Threshold sensitivity',
    },
    {
      query: 'Does the effect persist over 3-day and 5-day holding periods?',
      label: 'Holding horizon test',
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-3 pt-4 border-t border-zinc-800">
      <h3 className="text-sm font-bold text-zinc-100 font-sans">
        What should we investigate next?
      </h3>
      <p className="text-xs text-zinc-400 font-sans">
        Click any question to formulate a new structured experiment:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {questions.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectQuestion(item.query)}
            className="text-left p-4 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-2.5 group cursor-pointer text-xs shadow-sm"
          >
            <div className="text-[10px] font-mono uppercase font-semibold text-zinc-400">
              {item.label}
            </div>
            <p className="text-zinc-200 group-hover:text-white font-medium font-sans leading-snug">
              &ldquo;{item.query}&rdquo;
            </p>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium pt-1">
              <span>Test hypothesis</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
