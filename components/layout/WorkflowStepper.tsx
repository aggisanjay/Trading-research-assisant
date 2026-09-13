'use client';

import React from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { ResearchStage } from '@/lib/types/research';
import { cn } from '@/lib/utils';

interface WorkflowStepperProps {
  currentStage: ResearchStage;
  stagesCompleted: Record<ResearchStage, boolean>;
}

const STAGES: { id: ResearchStage; num: string; label: string; desc: string }[] = [
  { id: 'ask', num: '1', label: 'Ask', desc: 'Research Question' },
  { id: 'clarify', num: '2', label: 'Clarify', desc: 'Resolve Ambiguity' },
  { id: 'define', num: '3', label: 'Define', desc: 'Experiment Plan' },
  { id: 'test', num: '4', label: 'Test', desc: 'Run Backtest' },
  { id: 'learn', num: '5', label: 'Learn', desc: 'Results & Insights' },
];

export function WorkflowStepper({
  currentStage,
  stagesCompleted,
}: WorkflowStepperProps) {
  const stageOrder: ResearchStage[] = ['ask', 'clarify', 'define', 'test', 'learn'];
  const currentIndex = stageOrder.indexOf(currentStage);

  return (
    <div className="w-full bg-zinc-900 border-b border-zinc-800 py-3 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <nav aria-label="Progress" className="overflow-x-auto no-scrollbar">
          <ol className="flex items-center min-w-max gap-2 sm:gap-4 justify-between">
            {STAGES.map((stage, idx) => {
              const isCurrent = stage.id === currentStage;
              const isPast = idx < currentIndex || stagesCompleted[stage.id];

              return (
                <li key={stage.id} className="flex items-center gap-2 sm:gap-4">
                  <div
                    className={cn(
                      'flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs select-none text-left cursor-default transition-colors',
                      isCurrent && 'bg-zinc-800 text-white font-semibold border border-zinc-700 shadow-sm',
                      isPast && !isCurrent && 'text-zinc-300',
                      !isPast && !isCurrent && 'text-zinc-600'
                    )}
                  >
                    <span
                      className={cn(
                        'w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold border transition-colors',
                        isCurrent && 'border-emerald-500 bg-emerald-500/20 text-emerald-400',
                        isPast && !isCurrent && 'border-emerald-700/60 bg-emerald-950/60 text-emerald-400',
                        !isPast && !isCurrent && 'border-zinc-800 bg-zinc-900 text-zinc-600'
                      )}
                    >
                      {isPast && !isCurrent ? <Check className="w-3 h-3 text-emerald-400 stroke-[3]" /> : stage.num}
                    </span>
                    <div>
                      <div className={cn('text-xs font-medium', isCurrent ? 'text-white font-semibold' : isPast ? 'text-zinc-300' : 'text-zinc-500')}>
                        {stage.label}
                      </div>
                      <div className="text-[10px] text-zinc-500 hidden md:block">
                        {stage.desc}
                      </div>
                    </div>
                  </div>

                  {idx < STAGES.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-zinc-700 mx-1 shrink-0" />
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
}
