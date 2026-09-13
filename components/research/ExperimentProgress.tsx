'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExperimentProgressProps {
  onComplete: () => void;
}

const PIPELINE_STEPS = [
  'Parsing experiment specification & constraints',
  'Generating seeded deterministic NIFTY market data',
  'Filtering observations & isolating entry signals',
  'Simulating trade lifecycles & event returns',
  'Computing edge, drawdown & empirical distributions',
  'Synthesizing data findings vs AI interpretations',
];

export function ExperimentProgress({ onComplete }: ExperimentProgressProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < PIPELINE_STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 350);
          return prev;
        }
      });
    }, 280);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="w-full max-w-xl mx-auto my-12 bg-[#0c1120] border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6 shadow-2xl">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <div className="w-8 h-8 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <Cpu className="w-4 h-4 animate-pulse" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-100 font-sans">
            Executing Quantitative Pipeline
          </h3>
          <p className="text-xs text-slate-400 font-mono">
            Deterministic simulation on ~1,250 trading bars
          </p>
        </div>
      </div>

      <div className="space-y-3 font-mono text-xs">
        {PIPELINE_STEPS.map((step, idx) => {
          const isFinished = idx < currentStep;
          const isActive = idx === currentStep;
          const isPending = idx > currentStep;

          return (
            <div
              key={idx}
              className={cn(
                'flex items-center gap-3 p-2.5 rounded-lg transition-all',
                isActive && 'bg-emerald-950/30 border border-emerald-500/40 text-emerald-300',
                isFinished && 'text-slate-400',
                isPending && 'text-slate-600'
              )}
            >
              {isFinished ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : isActive ? (
                <Loader2 className="w-4 h-4 text-emerald-400 animate-spin shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-800 shrink-0" />
              )}
              <span className={cn('font-sans', isActive && 'font-medium text-slate-200')}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
