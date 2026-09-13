'use client';

import React from 'react';
import { ArrowRight, Compass } from 'lucide-react';
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
  const generateFollowUps = (): { query: string; rationale: string }[] => {
    const isHighVol = experiment.volatilityFilterDescription?.includes('High');
    const isOneDay = experiment.holdingPeriodDays === 1;
    const isOnePct = experiment.entryCondition.threshold === 1;

    const suggestions: { query: string; rationale: string }[] = [];

    if (!isHighVol) {
      suggestions.push({
        query: 'Does buying NIFTY after a 1% fall work better during high-volatility periods?',
        rationale: 'Isolate turbulent market regimes to test if panic selling induces sharper rebounds.',
      });
    } else {
      suggestions.push({
        query: 'Does buying NIFTY after a 1% fall outperform during low-volatility regimes?',
        rationale: 'Compare whether low-volatility regimes exhibit persistent drift rather than mean-reversion.',
      });
    }

    if (isOneDay) {
      suggestions.push({
        query: 'Does buying NIFTY after a 1% fall hold an edge over a 3-day holding period?',
        rationale: 'Evaluate whether the bounce is instantaneous or if the post-fall rebound persists for multiple sessions.',
      });
    } else {
      suggestions.push({
        query: 'Does buying NIFTY after a 1% fall produce immediate next-day bounce?',
        rationale: 'Narrow horizon down to overnight/1-day close-to-close to isolate immediate liquidity demand.',
      });
    }

    if (isOnePct) {
      suggestions.push({
        query: 'Does buying after a 2% fall produce a stronger edge than a 1% decline?',
        rationale: 'Test if signal strength scales with shock magnitude (monotonicity test).',
      });
    } else {
      suggestions.push({
        query: 'Does the edge survive after factoring in 15 bps of transaction friction?',
        rationale: 'Determine if empirical excess returns withstand real-world brokerage, STT, and slippage.',
      });
    }

    return suggestions;
  };

  const questions = generateFollowUps();

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 pt-4 border-t border-white/[0.08]">
      <div className="flex items-center gap-2">
        <Compass className="w-4 h-4 text-emerald-400" />
        <h3 className="text-sm sm:text-base font-bold text-slate-100 font-sans tracking-tight">
          What should we investigate next?
        </h3>
      </div>
      <p className="text-xs text-slate-400 font-sans">
        Quantitative discovery is iterative. Click any hypothesis below to formulate a new structured experiment:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {questions.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectQuestion(item.query)}
            className="text-left p-4 rounded-xl card-terminal-interactive flex flex-col justify-between group cursor-pointer space-y-3 shadow-lg"
          >
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 font-bold block">
                Next Hypothesis 0{idx + 1}
              </span>
              <p className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300 font-sans leading-relaxed">
                &ldquo;{item.query}&rdquo;
              </p>
            </div>

            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400">
              <span className="italic font-sans text-[10px] line-clamp-2">{item.rationale}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
