'use client';

import React from 'react';
import { History, Trash2 } from 'lucide-react';
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
    return null;
  }

  return (
    <div
      className={cn(
        'bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-xs flex flex-col gap-2.5 shadow-sm',
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2 font-mono">
        <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">
          Recent Research
        </span>
        <button
          onClick={onClearHistory}
          title="Clear history"
          className="text-zinc-500 hover:text-zinc-300 transition-colors p-1 rounded hover:bg-zinc-800 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-2 overflow-y-auto max-h-60">
        {history.map((item) => {
          const isPos = item.edge >= 0;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectHistory(item)}
              className="w-full text-left p-3 rounded-lg bg-zinc-950/70 hover:bg-zinc-800/80 border border-zinc-800 hover:border-zinc-700 transition-colors group cursor-pointer text-xs space-y-1.5"
            >
              <div className="text-zinc-200 group-hover:text-white font-medium line-clamp-1 leading-snug font-sans">
                &ldquo;{item.question}&rdquo;
              </div>
              <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-0.5 font-mono">
                <span>{item.timestamp}</span>
                <span className={cn('font-semibold', isPos ? 'text-emerald-400' : 'text-rose-400')}>
                  {isPos ? '+' : ''}{item.edge.toFixed(2)}% edge
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
