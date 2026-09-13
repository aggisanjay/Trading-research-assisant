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
import { LineChart as ChartIcon, BarChart3, TrendingUp, Layers } from 'lucide-react';
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
      <div className="h-80 w-full card-terminal rounded-2xl flex items-center justify-center text-slate-500 font-mono text-xs">
        Loading visualizations...
      </div>
    );
  }

  // Downsample equity points if array is large for smooth rendering
  const step = Math.max(1, Math.floor(results.equityCurve.length / 150));
  const sampledEquity = results.equityCurve.filter((_, idx) => idx % step === 0);

  // Trade signals data
  const tradesData = results.trades.slice(0, 80).map((t, idx) => ({
    name: `#${idx + 1}`,
    date: t.entryDate,
    returnPct: Math.round(t.netReturn * 10000) / 100,
    isWin: t.isWin,
  }));

  return (
    <div className="card-terminal rounded-2xl overflow-hidden shadow-2xl">
      {/* Chart Selector Tabs Header */}
      <div className="bg-slate-900/90 px-5 py-3.5 border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ChartIcon className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold font-mono uppercase tracking-wider text-slate-200">
            Quantitative Visualizations
          </span>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-xs p-1 bg-slate-950/80 rounded-lg border border-white/[0.06]">
          <button
            onClick={() => setActiveTab('equity')}
            className={cn(
              'px-3 py-1.5 rounded-md transition-all font-medium text-xs',
              activeTab === 'equity'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            )}
          >
            Cumulative Equity
          </button>
          <button
            onClick={() => setActiveTab('distribution')}
            className={cn(
              'px-3 py-1.5 rounded-md transition-all font-medium text-xs',
              activeTab === 'distribution'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            )}
          >
            Return Distribution
          </button>
          <button
            onClick={() => setActiveTab('signals')}
            className={cn(
              'px-3 py-1.5 rounded-md transition-all font-medium text-xs',
              activeTab === 'signals'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            )}
          >
            Trade Outcomes
          </button>
          <button
            onClick={() => setActiveTab('price')}
            className={cn(
              'px-3 py-1.5 rounded-md transition-all font-medium text-xs',
              activeTab === 'price'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            )}
          >
            NIFTY Price
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="p-5 sm:p-7">
        {/* CHART 1: Cumulative Strategy vs Baseline */}
        {activeTab === 'equity' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="space-x-5">
                <span className="inline-flex items-center gap-2 text-emerald-400 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                  Strategy Cumulative (Indexed 100)
                </span>
                <span className="inline-flex items-center gap-2 text-slate-400 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-500 inline-block"></span>
                  Baseline Buy &amp; Hold
                </span>
              </div>
              <span className="text-slate-500 text-[11px] hidden sm:inline font-mono">
                5-Year Simulated Performance
              </span>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sampledEquity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10, fontFamily: 'monospace' }} tickLine={false} />
                  <YAxis stroke="#64748b" domain={['auto', 'auto']} tick={{ fontSize: 10, fontFamily: 'monospace' }} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#07090f', borderColor: 'rgba(255,255,255,0.12)', fontSize: '12px', fontFamily: 'monospace', borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}
                    formatter={(value: any, name: string) => [
                      `${Number(value).toFixed(2)} pts`,
                      name === 'strategyEquity' ? 'Strategy' : 'Baseline',
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="strategyEquity"
                    stroke="#10b981"
                    strokeWidth={2.2}
                    dot={false}
                    name="strategyEquity"
                  />
                  <Line
                    type="monotone"
                    dataKey="baselineEquity"
                    stroke="#64748b"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    dot={false}
                    name="baselineEquity"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-slate-400 font-sans italic pt-1">
              Chart 1: Cumulative growth of 100 invested in the strategy during qualifying entry holding periods vs passive buy-and-hold baseline.
            </p>
          </div>
        )}

        {/* CHART 2: Return Distribution Histogram */}
        {activeTab === 'distribution' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-200 font-bold">
                Frequency of Trade Returns Following Entry Signals
              </span>
              <span className="text-slate-500 text-[11px] font-mono">Binned Event Study</span>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={results.returnDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="range" stroke="#64748b" tick={{ fontSize: 10, fontFamily: 'monospace' }} tickLine={false} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10, fontFamily: 'monospace' }} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#07090f', borderColor: 'rgba(255,255,255,0.12)', fontSize: '12px', fontFamily: 'monospace', borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}
                    formatter={(value: any) => [`${value} trades`, 'Count']}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {results.returnDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.isPositive ? '#10b981' : '#f43f5e'}
                        fillOpacity={0.85}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-slate-400 font-sans italic pt-1">
              Chart 2: Distribution of trade returns following qualifying entry signals. Green bars indicate profitable bounces.
            </p>
          </div>
        )}

        {/* CHART 3: Signal Performance */}
        {activeTab === 'signals' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-200 font-bold">
                Individual Trade Returns (Chronological Sample)
              </span>
              <span className="text-slate-500 text-[11px] font-mono">Recent 80 Signals</span>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tradesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 9, fontFamily: 'monospace' }} tickLine={false} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 10, fontFamily: 'monospace' }} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#07090f', borderColor: 'rgba(255,255,255,0.12)', fontSize: '12px', fontFamily: 'monospace', borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}
                    formatter={(value: any, _, item: any) => [
                      `${value >= 0 ? '+' : ''}${value}%`,
                      `Date: ${item.payload.date}`,
                    ]}
                  />
                  <ReferenceLine y={0} stroke="#475569" strokeWidth={1} />
                  <Bar dataKey="returnPct" radius={[2, 2, 0, 0]}>
                    {tradesData.map((entry, index) => (
                      <Cell
                        key={`cell-sig-${index}`}
                        fill={entry.isWin ? '#10b981' : '#f43f5e'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-slate-400 font-sans italic pt-1">
              Chart 3: Return per qualifying trade. Illustrates volatility clustering during market stress.
            </p>
          </div>
        )}

        {/* CHART 4: Market Price & Entry Signals */}
        {activeTab === 'price' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="space-x-4">
                <span className="inline-flex items-center gap-2 text-cyan-400 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
                  NIFTY 50 Simulated Price Trajectory
                </span>
              </div>
              <span className="text-slate-500 text-[11px] font-mono">~1,250 Daily Sessions</span>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sampledEquity} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10, fontFamily: 'monospace' }} tickLine={false} />
                  <YAxis stroke="#64748b" domain={['auto', 'auto']} tick={{ fontSize: 10, fontFamily: 'monospace' }} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#07090f', borderColor: 'rgba(255,255,255,0.12)', fontSize: '12px', fontFamily: 'monospace', borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}
                    formatter={(value: any) => [`${Math.round(value)} pts`, 'NIFTY Level']}
                  />
                  <Line
                    type="monotone"
                    dataKey="benchmarkPrice"
                    stroke="#06b6d4"
                    strokeWidth={1.8}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-slate-400 font-sans italic pt-1">
              Chart 4: Underlying synthetic market price series exhibiting non-stationary trending and volatility clustering regimes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
