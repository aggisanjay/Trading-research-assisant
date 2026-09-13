'use client';

import React, { useState } from 'react';
import { ClarificationChoices, ResearchQuestion } from '@/lib/types/research';
import { HelpCircle, ArrowRight, CheckCircle2, Sliders, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ClarificationPanelProps {
  parsedQuestion: ResearchQuestion;
  currentChoices: ClarificationChoices;
  onConfirm: (choices: ClarificationChoices) => void;
  onBackToAsk: () => void;
}

export function ClarificationPanel({
  parsedQuestion,
  currentChoices,
  onConfirm,
  onBackToAsk,
}: ClarificationPanelProps) {
  const [choices, setChoices] = useState<ClarificationChoices>(currentChoices);
  const [customThreshold, setCustomThreshold] = useState<string>('');
  const [isCustomThreshold, setIsCustomThreshold] = useState<boolean>(false);
  const [customHolding, setCustomHolding] = useState<string>('');
  const [isCustomHolding, setIsCustomHolding] = useState<boolean>(false);

  const handleConfirm = () => {
    const finalChoices = { ...choices };
    if (isCustomThreshold && customThreshold) {
      const parsed = parseFloat(customThreshold);
      if (!isNaN(parsed) && parsed > 0) {
        finalChoices.entryThresholdPct = parsed;
      }
    }
    if (isCustomHolding && customHolding) {
      const parsed = parseInt(customHolding, 10);
      if (!isNaN(parsed) && parsed > 0) {
        finalChoices.holdingPeriodDays = parsed;
      }
    }
    onConfirm(finalChoices);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Stage Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-medium">
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>STAGE 02 // AMBIGUITY RESOLUTION &amp; CLARIFICATION</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">
          Your question needs a few decisions before we can test it.
        </h2>
        <p className="text-sm text-slate-400 font-sans leading-relaxed">
          Quantitative backtests require non-ambiguous mathematical rules. Choose how to resolve
          the missing parameters identified in your research question.
        </p>
      </div>

      {/* Ambiguity Callout Box */}
      {parsedQuestion.missingInformation.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-mono space-y-2 shadow-lg">
          <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Missing Quantitative Variables Detected</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-300 font-sans text-xs">
            {parsedQuestion.missingInformation.map((info, idx) => (
              <li key={idx}>{info}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Clarification Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Entry Condition */}
        <div className="card-terminal rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs uppercase font-mono tracking-wider text-emerald-400 font-bold">
                01 // ENTRY CONDITION
              </span>
              <span className="text-[10px] text-amber-400 font-mono font-semibold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                AMBIGUOUS
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-100 mb-1 font-sans">
              What should &ldquo;sharp fall&rdquo; mean?
            </h3>
            <p className="text-xs text-slate-400 mb-3.5 font-sans leading-relaxed">
              Your definition of &ldquo;sharp fall&rdquo; directly affects which observations enter
              the experiment and determines sample size.
            </p>

            <div className="space-y-2 font-mono text-xs">
              {[1.0, 2.0, 3.0].map((val) => (
                <label
                  key={val}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all',
                    !isCustomThreshold && choices.entryThresholdPct === val
                      ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.12)]'
                      : 'bg-slate-900/60 border-white/[0.06] hover:border-white/[0.15] text-slate-300'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="entryThreshold"
                      checked={!isCustomThreshold && choices.entryThresholdPct === val}
                      onChange={() => {
                        setIsCustomThreshold(false);
                        setChoices({ ...choices, entryThresholdPct: val });
                      }}
                      className="accent-emerald-500"
                    />
                    <span className="font-semibold">≥ {val}% daily decline</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-sans">
                    {val === 1 ? 'High sample (~120+)' : val === 2 ? 'Moderate shocks' : 'Rare outliers'}
                  </span>
                </label>
              ))}

              {/* Custom option */}
              <label
                className={cn(
                  'flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all',
                  isCustomThreshold
                    ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300'
                    : 'bg-slate-900/60 border-white/[0.06] hover:border-white/[0.15] text-slate-300'
                )}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="entryThreshold"
                    checked={isCustomThreshold}
                    onChange={() => setIsCustomThreshold(true)}
                    className="accent-emerald-500"
                  />
                  <span>Custom %</span>
                </div>
                {isCustomThreshold && (
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      max="10"
                      placeholder="1.5"
                      value={customThreshold}
                      onChange={(e) => setCustomThreshold(e.target.value)}
                      className="w-16 px-2 py-0.5 rounded bg-slate-950 border border-emerald-500 text-emerald-300 text-xs focus:outline-none font-mono"
                    />
                    <span className="text-slate-400">%</span>
                  </div>
                )}
              </label>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 card-terminal-subtle p-2.5 rounded-lg border-l-2 border-l-emerald-500 font-sans leading-relaxed">
            <strong className="text-slate-300">Why it matters: </strong>
            A 1% threshold yields high statistical power, while 3% isolates severe liquidity panics.
          </div>
        </div>

        {/* Card 2: Holding Period */}
        <div className="card-terminal rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs uppercase font-mono tracking-wider text-emerald-400 font-bold">
                02 // HOLDING HORIZON
              </span>
              <span className="text-[10px] text-slate-400 font-mono">TIMEFRAME</span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-100 mb-1 font-sans">
              How long should the position be held?
            </h3>
            <p className="text-xs text-slate-400 mb-3.5 font-sans leading-relaxed">
              Determines the evaluation window for mean reversion or drift following the entry signal.
            </p>

            <div className="space-y-2 font-mono text-xs">
              {[1, 3, 5].map((days) => (
                <label
                  key={days}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all',
                    !isCustomHolding && choices.holdingPeriodDays === days
                      ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.12)]'
                      : 'bg-slate-900/60 border-white/[0.06] hover:border-white/[0.15] text-slate-300'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="holdingPeriod"
                      checked={!isCustomHolding && choices.holdingPeriodDays === days}
                      onChange={() => {
                        setIsCustomHolding(false);
                        setChoices({ ...choices, holdingPeriodDays: days });
                      }}
                      className="accent-emerald-500"
                    />
                    <span className="font-semibold">{days} trading day{days > 1 ? 's' : ''}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-sans">
                    {days === 1 ? 'Next-day close' : days === 3 ? 'Short swing' : '1 trading week'}
                  </span>
                </label>
              ))}

              <label
                className={cn(
                  'flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all',
                  isCustomHolding
                    ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300'
                    : 'bg-slate-900/60 border-white/[0.06] hover:border-white/[0.15] text-slate-300'
                )}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="holdingPeriod"
                    checked={isCustomHolding}
                    onChange={() => setIsCustomHolding(true)}
                    className="accent-emerald-500"
                  />
                  <span>Custom days</span>
                </div>
                {isCustomHolding && (
                  <input
                    type="number"
                    min="1"
                    max="30"
                    placeholder="10"
                    value={customHolding}
                    onChange={(e) => setCustomHolding(e.target.value)}
                    className="w-16 px-2 py-0.5 rounded bg-slate-950 border border-emerald-500 text-emerald-300 text-xs focus:outline-none font-mono"
                  />
                )}
              </label>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 card-terminal-subtle p-2.5 rounded-lg border-l-2 border-l-emerald-500 font-sans leading-relaxed">
            <strong className="text-slate-300">Why it matters: </strong>
            1-day tests immediate bounce; 5-day tests whether mean reversion persists into the week.
          </div>
        </div>

        {/* Card 3: Volatility Regime Filter */}
        <div className="card-terminal rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs uppercase font-mono tracking-wider text-purple-400 font-bold">
                03 // VOLATILITY REGIME
              </span>
              <span className="text-[10px] text-purple-300 font-mono font-semibold bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/60">
                FILTER
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-100 mb-1 font-sans">
              Filter by market volatility environment?
            </h3>
            <p className="text-xs text-slate-400 mb-3.5 font-sans leading-relaxed">
              Tests whether the strategy edge is concentrated during turbulent market phases.
            </p>

            <div className="space-y-2 font-mono text-xs">
              {[
                { id: 'all', label: 'All periods (Unfiltered)', desc: 'Include every market phase' },
                {
                  id: 'high_volatility',
                  label: 'High Volatility only',
                  desc: 'Rolling 20-day vol ≥ 75th percentile',
                },
                {
                  id: 'low_volatility',
                  label: 'Low Volatility only',
                  desc: 'Rolling 20-day vol ≤ 25th percentile',
                },
              ].map((item) => (
                <label
                  key={item.id}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all',
                    choices.volatilityRegime === item.id
                      ? 'bg-purple-950/40 border-purple-500/60 text-purple-200 shadow-[0_0_12px_rgba(168,85,247,0.12)]'
                      : 'bg-slate-900/60 border-white/[0.06] hover:border-white/[0.15] text-slate-300'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="volatilityRegime"
                      checked={choices.volatilityRegime === item.id}
                      onChange={() =>
                        setChoices({
                          ...choices,
                          volatilityRegime: item.id as 'all' | 'high_volatility' | 'low_volatility',
                        })
                      }
                      className="accent-purple-500"
                    />
                    <span className="font-semibold">{item.label}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-sans hidden sm:inline">
                    {item.desc}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div className="text-[11px] text-slate-400 card-terminal-subtle p-2.5 rounded-lg border-l-2 border-l-purple-500 font-sans leading-relaxed">
            <strong className="text-slate-300">Why it matters: </strong>
            High-vol regimes often feature violent panic selling followed by sharp snapback rallies.
          </div>
        </div>

        {/* Card 4: Historical Sample & Costs */}
        <div className="card-terminal rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs uppercase font-mono tracking-wider text-cyan-400 font-bold">
                04 // SAMPLE &amp; FRICTIONS
              </span>
              <span className="text-[10px] text-cyan-300 font-mono font-semibold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
                CALIBRATION
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-100 mb-1 font-sans">
              Sample window &amp; friction assumptions
            </h3>
            <p className="text-xs text-slate-400 mb-3.5 font-sans leading-relaxed">
              Configure historical lookback depth and execution drag assumptions.
            </p>

            <div className="space-y-3 font-mono text-xs">
              {/* Test Period */}
              <div>
                <span className="text-slate-400 text-[10px] block mb-1 font-mono uppercase tracking-wider font-semibold">
                  Historical Test Period
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 3, 5].map((yr) => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => setChoices({ ...choices, testPeriodYears: yr })}
                      className={cn(
                        'p-2.5 rounded-lg border text-center transition-all text-xs font-semibold',
                        choices.testPeriodYears === yr
                          ? 'bg-cyan-950/50 border-cyan-500 text-cyan-200 shadow-sm'
                          : 'bg-slate-900/60 border-white/[0.06] text-slate-400 hover:text-slate-200'
                      )}
                    >
                      {yr} Year{yr > 1 ? 's' : ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transaction Cost */}
              <div>
                <span className="text-slate-400 text-[10px] block mb-1 font-mono uppercase tracking-wider font-semibold">
                  Execution Drag Assumption
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { bps: 0, label: '0 bps (Demo / Gross)' },
                    { bps: 10, label: '10 bps (Est. Friction)' },
                  ].map((c) => (
                    <button
                      key={c.bps}
                      type="button"
                      onClick={() => setChoices({ ...choices, costBps: c.bps })}
                      className={cn(
                        'p-2.5 rounded-lg border text-center transition-all text-xs font-semibold',
                        choices.costBps === c.bps
                          ? 'bg-cyan-950/50 border-cyan-500 text-cyan-200 shadow-sm'
                          : 'bg-slate-900/60 border-white/[0.06] text-slate-400 hover:text-slate-200'
                      )}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 card-terminal-subtle p-2.5 rounded-lg border-l-2 border-l-cyan-500 font-sans leading-relaxed">
            <strong className="text-slate-300">Why it matters: </strong>
            A gross edge of +15 bps can be entirely consumed if round-trip slippage is 20 bps.
          </div>
        </div>
      </div>

      {/* Action CTA Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/[0.08]">
        <button
          onClick={onBackToAsk}
          className="text-xs text-slate-400 hover:text-slate-200 font-mono transition-colors"
        >
          ← Edit Research Question
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleConfirm}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 rounded-xl text-sm font-bold font-mono bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-[0_0_20px_rgba(16,185,129,0.35)] cursor-pointer hover:translate-y-[-1px]"
          >
            <span>Confirm Assumptions &amp; Define</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
