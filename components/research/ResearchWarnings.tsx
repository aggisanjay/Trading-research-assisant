'use client';

import React from 'react';
import { AlertOctagon, AlertTriangle, ShieldCheck, ZapOff, RefreshCcw, Layers } from 'lucide-react';

export function ResearchWarnings() {
  const warnings = [
    {
      title: 'Simulated Market Data Limitation',
      description:
        'This prototype evaluates a seeded synthetic NIFTY series. Real-world equity index dynamics involve complex order book liquidity, institutional rebalancing, and macro announcements not captured in geometric simulation models.',
      icon: AlertTriangle,
      level: 'High',
    },
    {
      title: 'Execution Slippage & Market Impact',
      description:
        'Assumes seamless fills at the closing print. In reality, executing large size after an intraday panic selloff entails significant bid-ask spread widening, market impact, and brokerage/STT taxes that can eliminate modest edges.',
      icon: ZapOff,
      level: 'High',
    },
    {
      title: 'Regime Clustering & Non-I.I.D. Signals',
      description:
        'Sharp fall events cluster heavily during market crashes and elevated VIX regimes. Returns are not independently distributed; consecutive trades share common macroeconomic headwinds and autocorrelation.',
      icon: Layers,
      level: 'Medium',
    },
    {
      title: 'Look-Ahead & Timing Feasibility',
      description:
        'Entering at "today\'s close" requires knowing today\'s percentage change before the market closes, introducing potential timing latency or execution slippage into the next session open.',
      icon: RefreshCcw,
      level: 'Medium',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2.5">
        <AlertOctagon className="w-4 h-4 text-rose-400" />
        <h3 className="text-sm sm:text-base font-bold text-slate-100 font-sans tracking-tight">
          Before trusting this result: Institutional Research Warnings
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 font-mono text-xs">
        {warnings.map((w, idx) => {
          const IconComponent = w.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-xl card-terminal space-y-2 hover:border-white/[0.15] transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-200 font-bold font-sans">
                  <IconComponent className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{w.title}</span>
                </div>
                <span
                  className={`text-[9px] px-2 py-0.5 rounded font-mono uppercase font-bold tracking-wider ${
                    w.level === 'High'
                      ? 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                      : 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  {w.level} Risk
                </span>
              </div>
              <p className="text-slate-400 text-xs font-sans leading-relaxed">
                {w.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
