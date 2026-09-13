'use client';

import React, { useEffect, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExperimentProgressProps {
  onComplete: () => void;
}

const PIPELINE_STEPS = [
  'Parsing experiment parameters',
  'Generating seeded NIFTY daily data (5 years)',
  'Testing entry signals and holding periods',
  'Calculating statistics and excess return',
  'Preparing findings and interpretation',
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
          }, 300);
          return prev;
        }
      });
    }, 250);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="w-full max-w-md mx-auto my-12 bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4 shadow-sm">
      <div className="border-b border-zinc-800 pb-3">
        <h3 className="text-base font-bold text-white font-sans">
          Running Backtest
        </h3>
        <p className="text-xs text-zinc-400 font-sans">
          Evaluating ~1,250 historical trading sessions...
        </p>
      </div>

      <div className="space-y-2 text-xs font-mono">
        {PIPELINE_STEPS.map((step, idx) => {
          const isFinished = idx < currentStep;
          const isActive = idx === currentStep;
          const isPending = idx > currentStep;

          return (
            <div
              key={idx}
              className={cn(
                'flex items-center gap-3 p-2.5 rounded-lg transition-colors',
                isActive && 'bg-zinc-800 text-emerald-400 font-medium border border-zinc-700',
                isFinished && 'text-zinc-300',
                isPending && 'text-zinc-600'
              )}
            >
              {isFinished ? (
                <Check className="w-4 h-4 text-emerald-400 shrink-0 stroke-[2.5]" />
              ) : isActive ? (
                <Loader2 className="w-4 h-4 text-emerald-400 animate-spin shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-zinc-700 shrink-0" />
              )}
              <span className="font-sans text-xs">
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
