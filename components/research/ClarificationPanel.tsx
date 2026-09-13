'use client';

import React, { useState } from 'react';
import { ClarificationChoices, ResearchQuestion } from '@/lib/types/research';
import { ArrowRight, AlertTriangle } from 'lucide-react';
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
      {/* Title & Guidance */}
      <div className="space-y-1.5">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
          Your question needs a few decisions before we can test it.
        </h2>
        <p className="text-sm text-zinc-400 font-sans leading-relaxed">
          The natural language query contains terms that must be quantitatively pinned down. Confirm your parameters below:
        </p>
      </div>

      {/* Ambiguity Alert */}
      {parsedQuestion.missingInformation.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-1.5">
          <div className="flex items-center gap-2 font-semibold text-amber-300 text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Parameters Requiring Clarification:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-zinc-300 text-xs pl-1">
            {parsedQuestion.missingInformation.map((info, idx) => (
              <li key={idx}>{info}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 4 Clear Decision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CARD 1: Entry Condition */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-mono uppercase font-semibold text-emerald-400">
                Entry Condition
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-medium">
                Decision Needed
              </span>
            </div>
            <h3 className="text-base font-semibold text-white mb-1">
              What should &ldquo;sharp fall&rdquo; mean?
            </h3>
            <p className="text-xs text-zinc-400 mb-3.5">
              Your definition of &ldquo;sharp fall&rdquo; directly affects which observations enter the experiment.
            </p>

            <div className="space-y-2 text-xs font-mono">
              {[1.0, 2.0, 3.0].map((val) => (
                <label
                  key={val}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all',
                    !isCustomThreshold && choices.entryThresholdPct === val
                      ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 font-semibold'
                      : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700 text-zinc-300'
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
                      className="accent-emerald-500 h-4 w-4"
                    />
                    <span>≥ {val}% daily decline</span>
                  </div>
                  <span className="text-[11px] text-zinc-400 font-sans font-normal">
                    {val === 1 ? '~120+ signals' : val === 2 ? 'Moderate shocks' : 'Rare outliers'}
                  </span>
                </label>
              ))}

              <label
                className={cn(
                  'flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all',
                  isCustomThreshold
                    ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 font-semibold'
                    : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700 text-zinc-300'
                )}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="entryThreshold"
                    checked={isCustomThreshold}
                    onChange={() => setIsCustomThreshold(true)}
                    className="accent-emerald-500 h-4 w-4"
                  />
                  <span>Custom %</span>
                </div>
                {isCustomThreshold && (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      max="10"
                      placeholder="1.5"
                      value={customThreshold}
                      onChange={(e) => setCustomThreshold(e.target.value)}
                      className="w-16 px-2 py-1 rounded bg-black border border-emerald-500 text-white text-xs focus:outline-none"
                    />
                    <span className="text-zinc-400">%</span>
                  </div>
                )}
              </label>
            </div>
          </div>
          <div className="text-xs text-zinc-400 bg-zinc-950/80 p-3 rounded-lg border border-zinc-800 leading-relaxed font-sans">
            <strong className="text-zinc-300">Why it matters:</strong> A 1% threshold yields high sample size; 3% isolates severe capitulation.
          </div>
        </div>

        {/* CARD 2: Holding Period */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-mono uppercase font-semibold text-emerald-400">
                Holding Horizon
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-medium">
                Timeframe
              </span>
            </div>
            <h3 className="text-base font-semibold text-white mb-1">
              How long should the position be held?
            </h3>
            <p className="text-xs text-zinc-400 mb-3.5">
              Determines how many trading sessions to hold the trade before evaluating the return.
            </p>

            <div className="space-y-2 text-xs font-mono">
              {[1, 3, 5].map((days) => (
                <label
                  key={days}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all',
                    !isCustomHolding && choices.holdingPeriodDays === days
                      ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 font-semibold'
                      : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700 text-zinc-300'
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
                      className="accent-emerald-500 h-4 w-4"
                    />
                    <span>{days} trading day{days > 1 ? 's' : ''}</span>
                  </div>
                  <span className="text-[11px] text-zinc-400 font-sans font-normal">
                    {days === 1 ? 'Next-day close' : days === 3 ? 'Short swing' : '1 full week'}
                  </span>
                </label>
              ))}

              <label
                className={cn(
                  'flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all',
                  isCustomHolding
                    ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 font-semibold'
                    : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700 text-zinc-300'
                )}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="holdingPeriod"
                    checked={isCustomHolding}
                    onChange={() => setIsCustomHolding(true)}
                    className="accent-emerald-500 h-4 w-4"
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
                    className="w-16 px-2 py-1 rounded bg-black border border-emerald-500 text-white text-xs focus:outline-none"
                  />
                )}
              </label>
            </div>
          </div>
          <div className="text-xs text-zinc-400 bg-zinc-950/80 p-3 rounded-lg border border-zinc-800 leading-relaxed font-sans">
            <strong className="text-zinc-300">Why it matters:</strong> 1-day isolates immediate bounce; multi-day tests whether rebound momentum persists.
          </div>
        </div>

        {/* CARD 3: Volatility Regime Filter */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-mono uppercase font-semibold text-emerald-400">
                Volatility Filter
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-medium">
                Regime Condition
              </span>
            </div>
            <h3 className="text-base font-semibold text-white mb-1">
              Filter by market volatility?
            </h3>
            <p className="text-xs text-zinc-400 mb-3.5">
              Test whether buying dips works better in turbulent versus calm periods.
            </p>

            <div className="space-y-2 text-xs font-mono">
              {[
                { id: 'all', label: 'All market periods', desc: 'No volatility filtering' },
                {
                  id: 'high_volatility',
                  label: 'High volatility only',
                  desc: '20-day vol ≥ 75th percentile',
                },
                {
                  id: 'low_volatility',
                  label: 'Low volatility only',
                  desc: '20-day vol ≤ 25th percentile',
                },
              ].map((item) => (
                <label
                  key={item.id}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all',
                    choices.volatilityRegime === item.id
                      ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 font-semibold'
                      : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700 text-zinc-300'
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
                      className="accent-emerald-500 h-4 w-4"
                    />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-sans hidden sm:inline">
                    {item.desc}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div className="text-xs text-zinc-400 bg-zinc-950/80 p-3 rounded-lg border border-zinc-800 leading-relaxed font-sans">
            <strong className="text-zinc-300">Why it matters:</strong> Identifies if dip-buying alpha is concentrated exclusively during market panics.
          </div>
        </div>

        {/* CARD 4: Lookback Window & Friction */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-mono uppercase font-semibold text-emerald-400">
                Sample Window &amp; Costs
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-medium">
                Calibration
              </span>
            </div>
            <h3 className="text-base font-semibold text-white mb-1">
              Test period &amp; transaction costs
            </h3>
            <p className="text-xs text-zinc-400 mb-3.5">
              Configure historical sample length and realistic friction assumptions.
            </p>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <span className="text-zinc-400 text-xs block mb-1.5 font-sans font-medium">
                  Historical Test Period:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 3, 5].map((yr) => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => setChoices({ ...choices, testPeriodYears: yr })}
                      className={cn(
                        'p-2.5 rounded-lg border text-center text-xs transition-all font-semibold cursor-pointer',
                        choices.testPeriodYears === yr
                          ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
                          : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                      )}
                    >
                      {yr} Year{yr > 1 ? 's' : ''}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-zinc-400 text-xs block mb-1.5 font-sans font-medium">
                  Transaction Costs:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { bps: 0, label: 'Ignore costs (0 bps)' },
                    { bps: 10, label: 'Include costs (10 bps)' },
                  ].map((c) => (
                    <button
                      key={c.bps}
                      type="button"
                      onClick={() => setChoices({ ...choices, costBps: c.bps })}
                      className={cn(
                        'p-2.5 rounded-lg border text-center text-xs transition-all font-semibold cursor-pointer',
                        choices.costBps === c.bps
                          ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
                          : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                      )}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="text-xs text-zinc-400 bg-zinc-950/80 p-3 rounded-lg border border-zinc-800 leading-relaxed font-sans">
            <strong className="text-zinc-300">Why it matters:</strong> Small apparent edges often disappear once real-world brokerage and slippage are deducted.
          </div>
        </div>
      </div>

      {/* Clear Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-zinc-800">
        <button
          onClick={onBackToAsk}
          className="text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          ← Edit research question
        </button>

        <button
          onClick={handleConfirm}
          className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3 rounded-lg text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 transition-colors shadow-sm cursor-pointer"
        >
          <span>Use these assumptions &amp; Define</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
