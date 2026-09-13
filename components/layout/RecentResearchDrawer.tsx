'use client';

import React from 'react';
import { Clock, History, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HistoryItem {
  id: string;
  question: string;
  timestamp: string;
  edge: number;
  signals: number;
}

interface RecentResearchDrawerProps {
  history: HistoryItem[];
  onSelectHistory: (item: HistoryItem) => void;
  onClearHistory: () => void;
  className?: string;
}

export function RecentResearchDrawer({
  history,
  onSelectHistory,
  onClearHistory,
  className,
}: RecentResearchDrawerProps) {
  if (history.length === 0) {
    return (
      <div
        className={cn(
          'w-full lg:w-64 card-terminal rounded-xl p-4 font-mono text-xs text-slate-500 shadow-xl',
          className
        )}
      >
        <div className="flex items-center gap-2 text-slate-400 font-semibold mb-2 text-xs tracking-wider">
          <History className="w-3.5 h-3.5 text-slate-400" />
          <span>RECENT SESSIONS</span>
        </div>
        <p className="text-slate-500 text-xs italic font-sans leading-relaxed">
          Completed research sessions will be saved here.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'w-full lg:w-64 card-terminal rounded-xl p-3.5 font-mono text-xs flex flex-col gap-3 shadow-2xl',
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-2.5">
        <div className="flex items-center gap-2 text-slate-300 font-bold tracking-wider text-[11px]">
          <History className="w-3.5 h-3.5 text-cyan-400" />
          <span>RECENT SESSIONS</span>
        </div>
        <button
          onClick={onClearHistory}
          title="Clear history"
          className="text-slate-500 hover:text-rose-400 transition-colors p-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-2 overflow-y-auto max-h-80 pr-0.5">
        {history.map((item) => {
          const isPos = item.edge >= 0;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectHistory(item)}
              className="w-full text-left p-3 rounded-lg card-terminal-interactive space-y-1.5 group cursor-pointer"
            >
              <div className="text-slate-200 text-xs font-sans font-medium line-clamp-2 group-hover:text-emerald-300 transition-colors leading-snug">
                &ldquo;{item.question}&rdquo;
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                <span className="flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5 text-slate-400" />
                  {item.timestamp}
                </span>
                <span
                  className={cn(
                    'font-mono font-bold px-1.5 py-0.5 rounded text-[10px]',
                    isPos
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-950/80 text-rose-400 border border-rose-500/30'
                  )}
                >
                  {isPos ? '+' : ''}
                  {item.edge.toFixed(2)}%
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
