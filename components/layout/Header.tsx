'use client';

import React from 'react';
import { RotateCcw, AlertTriangle, TrendingUp } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  hasActiveExperiment: boolean;
}

export function Header({ onReset, hasActiveExperiment }: HeaderProps) {
  return (
    <header className="border-b border-zinc-800 bg-zinc-900/90 backdrop-blur sticky top-0 z-40 px-4 sm:px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-base tracking-tight font-sans">
                AlphaResearch
              </span>
              <span className="px-2 py-0.5 text-[11px] font-mono font-medium uppercase bg-zinc-800 text-zinc-300 border border-zinc-700 rounded">
                Trading Assistant
              </span>
            </div>
          </div>
        </div>

        {/* Right: Status & Actions */}
        <div className="flex items-center gap-3">
          {/* Clear Demo Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Simulated NIFTY 50 Data</span>
          </div>

          {/* Reset button */}
          {hasActiveExperiment && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-zinc-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>New Research</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
