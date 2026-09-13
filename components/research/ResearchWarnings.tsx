'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';

export function ResearchWarnings() {
  const warnings = [
    {
      title: 'Simulated data only',
      desc: 'This demonstration uses synthetic market data. It does not reflect real exchange liquidity or macroeconomic conditions.',
    },
    {
      title: 'Slippage and friction excluded',
      desc: 'Fills are assumed at closing prices with zero slippage. In live trading, crossing bid-ask spreads after sharp falls can erase thin edges.',
    },
    {
      title: 'Look-ahead and execution bias',
      desc: 'Entering at "today\'s close" assumes knowing the closing price in advance or having access to Market-On-Close order facilities.',
    },
    {
      title: 'Regime clustering risk',
      desc: 'Sharp falls cluster in high-volatility periods. Consecutive trades are not independent, which can distort win rates and drawdowns.',
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-3">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-400" />
        <h3 className="text-sm font-bold text-zinc-100 font-sans">
          Before trusting this result
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {warnings.map((w, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1 shadow-sm">
            <div className="font-semibold text-zinc-100 font-sans text-xs">{w.title}</div>
            <p className="text-zinc-400 leading-relaxed font-sans text-xs">{w.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
