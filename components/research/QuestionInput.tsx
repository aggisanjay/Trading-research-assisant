'use client';

import React, { useState } from 'react';
import { Search, Sparkles, AlertCircle, ArrowRight, CornerDownLeft, Info, HelpCircle, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuestionInputProps {
  initialQuestion?: string;
  onAnalyze: (question: string) => Promise<void>;
  isLoading: boolean;
  edgeCaseError?: { type: string; message: string } | null;
}

const EXAMPLE_QUESTIONS = [
  {
    category: 'Mean Reversion',
    text: 'Does buying NIFTY after a sharp fall work?',
    description: 'Surfaces ambiguity around "sharp fall"',
  },
  {
    category: 'Regime Shift',
    text: 'Does buying NIFTY after a 1% fall work better in high volatility?',
    description: 'Tests volatility percentile regime filter',
  },
  {
    category: 'Threshold Scaling',
    text: 'Does buying after a 2% fall outperform normal days?',
    description: 'Evaluates shock magnitude versus baseline',
  },
  {
    category: 'Trend Following',
    text: 'Does momentum work better during high-volatility periods?',
    description: 'Contrasts trend persistence against mean reversion',
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
      {/* Hero Headline & Subtitle */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-medium shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>STAGE 01 // NATURAL LANGUAGE FORMULATION</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-sans leading-tight">
          Turn a market question <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            into verifiable evidence.
          </span>
        </h1>
        <p className="text-sm sm:text-base text-slate-400 font-sans leading-relaxed max-w-2xl">
          Ask a trading research hypothesis in plain English. We detect missing quantitative
          parameters, eliminate unstated bias, and formulate a reproducible experiment.
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative rounded-2xl bg-[#0b0e18] border border-white/[0.12] focus-within:border-emerald-500/80 focus-within:ring-2 focus-within:ring-emerald-500/20 shadow-2xl transition-all">
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
            placeholder="e.g. Does buying NIFTY after a sharp fall work?"
            className="w-full bg-transparent px-5 pt-5 pb-14 text-base text-slate-100 placeholder:text-slate-500 focus:outline-none resize-none font-sans"
          />

          {/* Bottom Bar inside input */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
              Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-white/[0.1] text-slate-300 font-semibold">Ctrl + Enter</kbd> to analyze
            </span>
            <button
              type="submit"
              disabled={isLoading || !question.trim()}
              className={cn(
                'ml-auto flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold font-mono transition-all',
                isLoading || !question.trim()
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/[0.06]'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.35)] cursor-pointer hover:translate-y-[-1px]'
              )}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing Question...</span>
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

        {/* Error Alert if any */}
        {(localError || edgeCaseError) && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-start gap-3 animate-fadeIn shadow-lg">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <div>
              <span className="font-bold uppercase tracking-wider block mb-1">
                {edgeCaseError?.type ? `Input Guardrail: ${edgeCaseError.type.replace('_', ' ')}` : 'Input Notice'}
              </span>
              <p className="text-rose-200/90 font-sans leading-relaxed text-xs">
                {edgeCaseError?.message || localError}
              </p>
            </div>
          </div>
        )}
      </form>

      {/* Example Question Cards Grid */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono uppercase tracking-wider">
          <Compass className="w-3.5 h-3.5 text-slate-400" />
          <span>Or explore these benchmark inquiries:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {EXAMPLE_QUESTIONS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleChipClick(sample.text)}
              disabled={isLoading}
              className="text-left p-3.5 card-terminal-interactive rounded-xl flex flex-col justify-between group cursor-pointer space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 font-medium">
                  {sample.category}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-200 group-hover:text-white font-sans leading-snug">
                &ldquo;{sample.text}&rdquo;
              </p>
              <span className="text-[11px] text-slate-400 font-sans line-clamp-1">
                {sample.description}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Responsible AI Value Proposition */}
      <div className="p-4 rounded-xl card-terminal-subtle text-xs text-slate-400 flex items-start gap-3.5">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="text-slate-200 font-semibold font-mono text-[11px] uppercase tracking-wider block">
            Responsible Quantitative AI Architecture
          </span>
          <p className="text-slate-400 leading-relaxed font-sans text-xs">
            Unlike generic chatbots, your inquiry is not silently executed with arbitrary guesses.
            The system first isolates qualitative phrases (like &ldquo;sharp fall&rdquo;), makes every
            latent assumption explicit, and constructs an auditable experiment before touching market data.
          </p>
        </div>
      </div>
    </div>
  );
}
