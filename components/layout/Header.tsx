'use client';

import React from 'react';
import { Terminal, RotateCcw, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  hasActiveExperiment: boolean;
}

export function Header({ onReset, hasActiveExperiment }: HeaderProps) {
  return (
    <header className="border-b border-white/[0.08] bg-[#07090f]/95 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left branding */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-white text-sm lg:text-base font-sans">
                ALPHA RESEARCH
              </span>
              <span className="px-1.5 py-0.5 text-[9px] uppercase font-mono tracking-widest bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 rounded font-semibold">
                QUANT STUDIO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono tracking-wide hidden sm:block">
              ASK → CLARIFY → DEFINE → TEST → LEARN
            </p>
          </div>
        </div>

        {/* Center / Right Badges */}
        <div className="flex items-center gap-2.5">
          {/* Demo Data Disclaimer Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-semibold text-[11px] tracking-wide">SIMULATED DATA</span>
            <span className="text-[10px] text-amber-200/70 hidden md:inline">
              (5Y Seeded NIFTY)
            </span>
          </div>

          {/* Engine Status */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-900/80 border border-white/[0.08] text-slate-300 text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] text-slate-400 font-medium">ENGINE ONLINE</span>
          </div>

          {/* Reset / New Research CTA */}
          {hasActiveExperiment && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 hover:text-white border border-white/[0.1] hover:border-white/[0.2] transition-all shadow-sm"
              title="Start a new research question"
            >
              <RotateCcw className="w-3 h-3 text-slate-400" />
              <span>New Session</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
