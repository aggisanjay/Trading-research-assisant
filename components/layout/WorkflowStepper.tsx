'use client';

import React from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { ResearchStage } from '@/lib/types/research';
import { cn } from '@/lib/utils';

interface WorkflowStepperProps {
  currentStage: ResearchStage;
  onSelectStage?: (stage: ResearchStage) => void;
  stagesCompleted: Record<ResearchStage, boolean>;
}

const STAGES: { id: ResearchStage; num: string; label: string; description: string }[] = [
  { id: 'ask', num: '01', label: 'ASK', description: 'Plain English Inquiry' },
  { id: 'clarify', num: '02', label: 'CLARIFY', description: 'Ambiguity & Decisions' },
  { id: 'define', num: '03', label: 'DEFINE', description: 'Testable Specification' },
  { id: 'test', num: '04', label: 'TEST', description: 'Deterministic Backtest' },
  { id: 'learn', num: '05', label: 'LEARN', description: 'Data vs Interpretation' },
];

export function WorkflowStepper({
  currentStage,
  onSelectStage,
  stagesCompleted,
}: WorkflowStepperProps) {
  const stageOrder: ResearchStage[] = ['ask', 'clarify', 'define', 'test', 'learn'];
  const currentIndex = stageOrder.indexOf(currentStage);

  return (
    <div className="w-full bg-[#080b13]/90 border-b border-white/[0.06] py-2.5 px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">
        <nav aria-label="Progress" className="overflow-x-auto no-scrollbar">
          <ol className="flex items-center min-w-max gap-1 sm:gap-2 justify-between">
            {STAGES.map((stage, idx) => {
              const isCurrent = stage.id === currentStage;
              const isPast = idx < currentIndex || stagesCompleted[stage.id];
              const isClickable = isPast && onSelectStage;

              return (
                <li key={stage.id} className="flex items-center gap-1 sm:gap-2">
                  <button
                    disabled={!isClickable}
                    onClick={() => isClickable && onSelectStage(stage.id)}
                    className={cn(
                      'flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-all text-xs font-mono select-none',
                      isCurrent &&
                        'bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 font-semibold shadow-[0_0_16px_rgba(16,185,129,0.15)]',
                      isPast && !isCurrent && 'text-slate-300 hover:text-white hover:bg-white/[0.04] cursor-pointer',
                      !isPast && !isCurrent && 'text-slate-500 cursor-not-allowed opacity-60'
                    )}
                  >
                    <span
                      className={cn(
                        'w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold border transition-colors',
                        isCurrent && 'border-emerald-400 bg-emerald-500/20 text-emerald-300 shadow-sm',
                        isPast && !isCurrent && 'border-emerald-700/60 bg-emerald-950/40 text-emerald-400',
                        !isPast && !isCurrent && 'border-slate-800 bg-slate-900/50 text-slate-500'
                      )}
                    >
                      {isPast && !isCurrent ? <Check className="w-3 h-3 stroke-[2.5]" /> : stage.num}
                    </span>
                    <div className="text-left">
                      <div className="font-semibold tracking-wider text-[11px] leading-tight">
                        {stage.label}
                      </div>
                      <div className="text-[10px] text-slate-400 font-sans hidden lg:block leading-tight">
                        {stage.description}
                      </div>
                    </div>
                  </button>

                  {idx < STAGES.length - 1 && (
                    <ChevronRight
                      className={cn(
                        'w-3.5 h-3.5 shrink-0 mx-0.5',
                        idx < currentIndex ? 'text-emerald-500/60' : 'text-slate-800'
                      )}
                    />
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
