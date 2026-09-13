'use client';

import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';
import { BacktestResult, Experiment } from '@/lib/types/research';
import { cn } from '@/lib/utils';

interface ChartsViewProps {
  results: BacktestResult;
  experiment: Experiment;
}

export function ChartsView({ results, experiment }: ChartsViewProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'equity' | 'distribution' | 'signals' | 'price'>('equity');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="h-72 w-full bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-zinc-500 text-xs font-mono">
        Loading charts...
      </div>
    );
  }

  const step = Math.max(1, Math.floor(results.equityCurve.length / 150));
  const sampledEquity = results.equityCurve.filter((_, idx) => idx % step === 0);

  const tradesData = results.trades.slice(0, 80).map((t, idx) => ({
    name: `#${idx + 1}`,
    date: t.entryDate,
    returnPct: Math.round(t.netReturn * 10000) / 100,
    isWin: t.isWin,
  }));

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
      {/* Chart Selector Tabs */}
      <div className="bg-zinc-850 px-5 py-3 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
          Visualizations
        </span>

        <div className="flex items-center gap-1.5 text-xs font-mono">
          <button
            onClick={() => setActiveTab('equity')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer',
              activeTab === 'equity'
                ? 'bg-zinc-800 text-white font-semibold border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            )}
          >
            Cumulative Strategy vs Baseline
          </button>
          <button
            onClick={() => setActiveTab('distribution')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer',
              activeTab === 'distribution'
                ? 'bg-zinc-800 text-white font-semibold border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            )}
          >
            Return Distribution
          </button>
          <button
            onClick={() => setActiveTab('signals')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer',
              activeTab === 'signals'
                ? 'bg-zinc-800 text-white font-semibold border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            )}
          >
            Signal Performance
          </button>
          <button
            onClick={() => setActiveTab('price')}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer',
              activeTab === 'price'
                ? 'bg-zinc-800 text-white font-semibold border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            )}
          >
            Market Price
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="p-5 sm:p-6">
        {/* CHART 1: Cumulative Strategy vs Baseline */}
        {activeTab === 'equity' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <div className="space-x-5">
                <span className="text-emerald-400 font-bold inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  Strategy Cumulative
                </span>
                <span className="text-zinc-400 inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-500"></span>
                  Baseline Buy &amp; Hold
                </span>
              </div>
              <span className="text-zinc-500 text-[11px]">Indexed to 100</span>
            </div>

            <div className="h-72 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sampledEquity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="date" stroke="#71717a" tick={{ fontSize: 10, fontFamily: 'monospace' }} tickLine={false} />
                  <YAxis stroke="#71717a" domain={['auto', 'auto']} tick={{ fontSize: 10, fontFamily: 'monospace' }} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', fontSize: '11px', fontFamily: 'monospace', borderRadius: '8px' }}
                    formatter={(value: any, name: string) => [
                      `${Number(value).toFixed(2)} pts`,
                      name === 'strategyEquity' ? 'Strategy' : 'Baseline',
                    ]}
                  />
                  <Line type="monotone" dataKey="strategyEquity" stroke="#10b981" strokeWidth={2} dot={false} name="strategyEquity" />
                  <Line type="monotone" dataKey="baselineEquity" stroke="#a1a1aa" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="baselineEquity" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-zinc-400">
              Chart 1: Cumulative return of the strategy when active in trades vs passive buy-and-hold baseline.
            </p>
          </div>
        )}

        {/* CHART 2: Return Distribution */}
        {activeTab === 'distribution' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span className="text-white font-medium">Next-Day Return Distribution</span>
              <span className="text-zinc-500 text-[11px]">Binned by Return Range</span>
            </div>

            <div className="h-72 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={results.returnDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="range" stroke="#71717a" tick={{ fontSize: 10, fontFamily: 'monospace' }} tickLine={false} />
                  <YAxis stroke="#71717a" tick={{ fontSize: 10, fontFamily: 'monospace' }} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', fontSize: '11px', fontFamily: 'monospace', borderRadius: '8px' }}
                    formatter={(value: any) => [`${value} trades`, 'Frequency']}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {results.returnDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.isPositive ? '#10b981' : '#f43f5e'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-zinc-400">
              Chart 2: Frequency distribution of trade returns following qualifying entry signals. Green bars show profitable trades.
            </p>
          </div>
        )}

        {/* CHART 3: Signal Performance */}
        {activeTab === 'signals' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span className="text-white font-medium">Trade Outcome Sequence</span>
              <span className="text-zinc-500 text-[11px]">Recent 80 Trades</span>
            </div>

            <div className="h-72 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tradesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="name" stroke="#71717a" tick={{ fontSize: 9, fontFamily: 'monospace' }} tickLine={false} />
                  <YAxis stroke="#71717a" tick={{ fontSize: 10, fontFamily: 'monospace' }} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', fontSize: '11px', fontFamily: 'monospace', borderRadius: '8px' }}
                    formatter={(value: any, _, item: any) => [
                      `${value >= 0 ? '+' : ''}${value}%`,
                      `Date: ${item.payload.date}`,
                    ]}
                  />
                  <ReferenceLine y={0} stroke="#4b5563" />
                  <Bar dataKey="returnPct" radius={[2, 2, 0, 0]}>
                    {tradesData.map((entry, index) => (
                      <Cell key={`sig-${index}`} fill={entry.isWin ? '#10b981' : '#f43f5e'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-zinc-400">
              Chart 3: Individual trade return sequence showing return dispersion across market phases.
            </p>
          </div>
        )}

        {/* CHART 4: Market Price */}
        {activeTab === 'price' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span className="text-white font-medium">Simulated NIFTY 50 Daily Price</span>
              <span className="text-zinc-500 text-[11px]">~1,250 Sessions</span>
            </div>

            <div className="h-72 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sampledEquity} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="date" stroke="#71717a" tick={{ fontSize: 10, fontFamily: 'monospace' }} tickLine={false} />
                  <YAxis stroke="#71717a" domain={['auto', 'auto']} tick={{ fontSize: 10, fontFamily: 'monospace' }} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#3f3f46', fontSize: '11px', fontFamily: 'monospace', borderRadius: '8px' }}
                    formatter={(value: any) => [`${Math.round(value)} pts`, 'Index Price']}
                  />
                  <Line type="monotone" dataKey="benchmarkPrice" stroke="#38bdf8" strokeWidth={1.8} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-zinc-400">
              Chart 4: Synthetic NIFTY 50 benchmark price series used in the backtest demonstration.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
