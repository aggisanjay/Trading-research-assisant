'use client';

import React, { useState } from 'react';
import { ArrowRight, AlertCircle, Info, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuestionInputProps {
  initialQuestion?: string;
  onAnalyze: (question: string) => Promise<void>;
  isLoading: boolean;
  edgeCaseError?: { type: string; message: string } | null;
}

const EXAMPLE_QUESTIONS = [
  {
    title: 'Sharp Fall Rebound',
    question: 'Does buying NIFTY after a sharp fall work?',
    tag: 'Ambiguity Test',
  },
  {
    title: 'Threshold Edge',
    question: 'Does buying NIFTY after a 1% fall have an edge?',
    tag: 'Baseline Comparison',
  },
  {
    title: 'Volatility Regimes',
    question: 'Does buying NIFTY after a sharp fall work better in high volatility?',
    tag: 'Regime Filter',
  },
  {
    title: 'Shock Magnitude',
    question: 'Does buying after a 2% fall outperform normal days?',
    tag: 'Outlier Test',
  },
];

export function QuestionInput({
  initialQuestion = '',
  onAnalyze,
  isLoading,
  edgeCaseError,
}: QuestionInputProps) {
  const [question, setQuestion] = useState(initialQuestion);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) {
      setLocalError('Enter a research question to continue.');
      return;
    }
    setLocalError(null);
    onAnalyze(trimmed);
  };

  const handleChipClick = (sample: string) => {
    setQuestion(sample);
    setLocalError(null);
    onAnalyze(sample);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-7">
      {/* Headline & Subtitle */}
      <div className="space-y-2.5 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-sans">
          Turn a market question into evidence.
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 font-sans leading-relaxed">
          Ask a trading research question in plain English. We&apos;ll turn it into a testable experiment.
        </p>
      </div>

      {/* Input Card Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="rounded-xl bg-zinc-900 border border-zinc-700 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all shadow-md overflow-hidden">
          <textarea
            rows={3}
            value={question}
            onChange={(e) => {
              setQuestion(e.target.value);
              if (localError) setLocalError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                handleSubmit();
              }
            }}
            placeholder="Does buying NIFTY after a sharp fall work?"
            className="w-full bg-transparent p-4 sm:p-5 text-base text-zinc-100 placeholder:text-zinc-500 focus:outline-none resize-none font-sans"
          />

          {/* Bottom Bar inside Input Card */}
          <div className="p-3 sm:px-5 sm:py-3.5 border-t border-zinc-800 bg-zinc-950/60 flex items-center justify-between">
            <span className="text-xs text-zinc-500 font-mono hidden sm:inline">
              Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">Ctrl + Enter</kbd> to analyze
            </span>

            <button
              type="submit"
              disabled={isLoading || !question.trim()}
              className={cn(
                'ml-auto flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer shadow-sm',
                isLoading || !question.trim()
                  ? 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 hover:shadow'
              )}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing question...</span>
                </>
              ) : (
                <>
                  <span>Analyze Question</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {(localError || edgeCaseError) && (
          <div className="p-4 rounded-lg bg-rose-950/30 border border-rose-800 text-rose-200 text-xs flex items-start gap-3">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <div>
              <span className="font-semibold text-rose-300 block mb-0.5">
                {edgeCaseError?.type ? `Input Notice: ${edgeCaseError.type.replace('_', ' ')}` : 'Input Notice'}
              </span>
              <p className="text-rose-200/90 leading-relaxed font-sans">
                {edgeCaseError?.message || localError}
              </p>
            </div>
          </div>
        )}
      </form>

      {/* Clear Example Question Cards */}
      <div className="space-y-3 pt-1">
        <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Example Research Hypotheses
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {EXAMPLE_QUESTIONS.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleChipClick(item.question)}
              disabled={isLoading}
              className="text-left p-4 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-2.5 group cursor-pointer shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase font-semibold text-emerald-400">
                  {item.title}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                  {item.tag}
                </span>
              </div>
              <p className="text-sm font-medium text-zinc-200 group-hover:text-white font-sans leading-snug">
                &ldquo;{item.question}&rdquo;
              </p>
              <div className="text-[11px] text-zinc-500 group-hover:text-emerald-400 flex items-center gap-1 transition-colors">
                <span>Select hypothesis</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Clear Philosophy Box */}
      <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 text-xs text-zinc-400 flex items-start gap-3">
        <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="text-zinc-200 font-semibold block text-xs">
            Responsible Quantitative Research
          </span>
          <p className="text-zinc-400 leading-relaxed text-xs">
            Your question is not automatically turned into a strategy. The system first identifies
            ambiguity, makes assumptions visible, and defines a test.
          </p>
        </div>
      </div>
    </div>
  );
}
