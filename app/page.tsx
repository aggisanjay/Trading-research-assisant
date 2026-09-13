'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { WorkflowStepper } from '@/components/layout/WorkflowStepper';
import { ExperimentContextPanel } from '@/components/layout/ExperimentContextPanel';
import { RecentResearchDrawer } from '@/components/layout/RecentResearchDrawer';
import { QuestionInput } from '@/components/research/QuestionInput';
import { ClarificationPanel } from '@/components/research/ClarificationPanel';
import { ExperimentDefinition } from '@/components/research/ExperimentDefinition';
import { ExperimentProgress } from '@/components/research/ExperimentProgress';
import { ResultsSummary } from '@/components/research/ResultsSummary';
import { ChartsView } from '@/components/research/ChartsView';
import { LearnSection } from '@/components/research/LearnSection';
import { ResearchWarnings } from '@/components/research/ResearchWarnings';
import { NextQuestions } from '@/components/research/NextQuestions';

import {
  ResearchStage,
  ResearchQuestion,
  ClarificationChoices,
  Experiment,
  BacktestResult,
} from '@/lib/types/research';
import { generateMockMarketData } from '@/lib/backtest/market-data';
import { runBacktest } from '@/lib/backtest/backtest';
import { calculateStatistics } from '@/lib/backtest/statistics';

interface HistoryItem {
  id: string;
  question: string;
  timestamp: string;
  edge: number;
  signals: number;
}

const DEFAULT_CLARIFICATIONS: ClarificationChoices = {
  entryThresholdPct: 1.0,
  holdingPeriodDays: 1,
  testPeriodYears: 5,
  exitRule: 'holding_period',
  volatilityRegime: 'all',
  costBps: 0,
};

export default function Home() {
  const [stage, setStage] = useState<ResearchStage>('ask');
  const [question, setQuestion] = useState<string>('');
  const [parsedQuestion, setParsedQuestion] = useState<ResearchQuestion | null>(null);
  const [clarifications, setClarifications] = useState<ClarificationChoices>(DEFAULT_CLARIFICATIONS);
  const [experiment, setExperiment] = useState<Experiment | null>(null);
  const [results, setResults] = useState<BacktestResult | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [edgeCaseError, setEdgeCaseError] = useState<{ type: string; message: string } | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const [stagesCompleted, setStagesCompleted] = useState<Record<ResearchStage, boolean>>({
    ask: false,
    clarify: false,
    define: false,
    test: false,
    learn: false,
  });

  // Load history from localStorage on initial mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('alpha_research_history');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Could not read history from localStorage', e);
    }
  }, []);

  const saveToHistory = (item: HistoryItem) => {
    setHistory((prev) => {
      const updated = [item, ...prev.filter((h) => h.question !== item.question)].slice(0, 8);
      try {
        localStorage.setItem('alpha_research_history', JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not save history to localStorage', e);
      }
      return updated;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('alpha_research_history');
    } catch (e) {}
  };

  // Reset to initial ASK state
  const handleReset = () => {
    setStage('ask');
    setQuestion('');
    setParsedQuestion(null);
    setClarifications(DEFAULT_CLARIFICATIONS);
    setExperiment(null);
    setResults(null);
    setIsTesting(false);
    setEdgeCaseError(null);
    setStagesCompleted({
      ask: false,
      clarify: false,
      define: false,
      test: false,
      learn: false,
    });
  };

  // Analyze Question (Transition ASK -> CLARIFY)
  const handleAnalyzeQuestion = async (queryText: string) => {
    setIsAnalyzing(true);
    setEdgeCaseError(null);
    setQuestion(queryText);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: queryText }),
      });

      if (!res.ok) {
        throw new Error('Analysis service returned an error');
      }

      const parsed: ResearchQuestion = await res.json();
      setParsedQuestion(parsed);

      // Check for edge case blocking conditions
      if (parsed.edgeCase) {
        if (
          parsed.edgeCase.type === 'empty' ||
          parsed.edgeCase.type === 'too_vague' ||
          parsed.edgeCase.type === 'contradictory_rules'
        ) {
          setEdgeCaseError(parsed.edgeCase);
          setIsAnalyzing(false);
          return;
        }
      }

      // Pre-populate clarifications if user explicitly specified parameters
      const updatedChoices = { ...DEFAULT_CLARIFICATIONS };

      if (parsed.parameterSources.entryThreshold === 'explicit' && parsed.entryCondition) {
        const pctMatch = parsed.entryCondition.match(/(\d+(?:\.\d+)?)/);
        if (pctMatch) {
          updatedChoices.entryThresholdPct = parseFloat(pctMatch[1]);
        }
      }

      if (parsed.parameterSources.holdingPeriod === 'explicit' && parsed.holdingPeriod) {
        const dayMatch = parsed.holdingPeriod.match(/(\d+)/);
        if (dayMatch) {
          updatedChoices.holdingPeriodDays = parseInt(dayMatch[1], 10);
        }
      }

      if (parsed.parameterSources.volatilityFilter === 'explicit') {
        updatedChoices.volatilityRegime = 'high_volatility';
      }

      setClarifications(updatedChoices);
      setStagesCompleted((prev) => ({ ...prev, ask: true }));
      setStage('clarify');
    } catch (err: any) {
      console.error(err);
      setEdgeCaseError({
        type: 'network_error',
        message: 'Unable to analyze question. Please check network connectivity or try again.',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Confirm Clarifications (Transition CLARIFY -> DEFINE)
  const handleConfirmClarifications = (choices: ClarificationChoices) => {
    setClarifications(choices);

    const inst = parsedQuestion?.instrument || 'NIFTY 50';
    const isHighVol = choices.volatilityRegime === 'high_volatility';
    const isLowVol = choices.volatilityRegime === 'low_volatility';

    const filterDesc = isHighVol
      ? 'High Volatility Regime (Rolling 20d vol ≥ 75th percentile)'
      : isLowVol
      ? 'Low Volatility Regime (Rolling 20d vol ≤ 25th percentile)'
      : 'All historical market regimes';

    const hypothesis = isHighVol
      ? `Buying ${inst} following a ≥${choices.entryThresholdPct}% daily decline during high-volatility regimes produces an excess return over the unconditional baseline return.`
      : `Buying ${inst} after a ≥${choices.entryThresholdPct}% daily decline produces a positive next-day average excess return compared to unconditional market holding periods.`;

    const aiInterpretation = `The test evaluates whether next-day holding returns following daily declines of ≥${choices.entryThresholdPct}% exhibit statistical mean-reversion and outperform unconditional market drift over a ${choices.testPeriodYears}-year horizon.`;

    const newExperiment: Experiment = {
      id: `exp-${Date.now()}`,
      question: question || parsedQuestion?.rawQuestion || '',
      aiInterpretation,
      instrument: inst,
      timeframe: 'Daily',
      entryCondition: {
        type: 'daily_decline',
        threshold: choices.entryThresholdPct,
        description: `NIFTY falls ≥ ${choices.entryThresholdPct}% from previous close`,
      },
      exitCondition: {
        type: choices.exitRule,
        description: `Sell at close after ${choices.holdingPeriodDays} trading day${
          choices.holdingPeriodDays > 1 ? 's' : ''
        }`,
      },
      holdingPeriodDays: choices.holdingPeriodDays,
      testPeriodYears: choices.testPeriodYears,
      filters: isHighVol ? ['High Volatility (≥75th percentile)'] : [],
      volatilityFilterDescription: filterDesc,
      transactionCostBps: choices.costBps,
      hypothesis,
      assumptions: [
        `Sharp fall = daily NIFTY decline ≥ ${choices.entryThresholdPct}%`,
        `Holding period = ${choices.holdingPeriodDays} trading day(s)`,
        `Exit = close after ${choices.holdingPeriodDays} day(s)`,
        `Test period = ${choices.testPeriodYears} years`,
        `Transaction costs = ${choices.costBps} bps per trade`,
      ],
      status: 'ready',
      createdAt: new Date().toISOString(),
    };

    setExperiment(newExperiment);
    setStagesCompleted((prev) => ({ ...prev, clarify: true }));
    setStage('define');
  };

  // Start Backtest Execution (Transition DEFINE -> TEST)
  const handleStartBacktest = () => {
    setIsTesting(true);
    setStage('test');
  };

  // Complete Backtest Execution (Transition TEST -> LEARN)
  const handleBacktestAnimationComplete = () => {
    if (!experiment) return;

    // 1. Generate seeded deterministic market data
    const bars = generateMockMarketData(42, clarifications.testPeriodYears);

    // 2. Execute deterministic backtest simulation
    const execution = runBacktest(bars, clarifications);

    // 3. Compute empirical statistics and separated learnings
    const calculatedResults = calculateStatistics(
      bars,
      execution.trades,
      execution.equityCurve,
      clarifications
    );

    setResults(calculatedResults);
    setIsTesting(false);

    // Update experiment status
    setExperiment((prev) => (prev ? { ...prev, status: 'complete' } : null));

    // Save to history
    saveToHistory({
      id: experiment.id,
      question: experiment.question,
      timestamp: 'Just now',
      edge: calculatedResults.estimatedEdge,
      signals: calculatedResults.qualifyingSignals,
    });

    setStagesCompleted((prev) => ({ ...prev, define: true, test: true, learn: true }));
    setStage('learn');
  };

  // Handle selecting a question from NextQuestions or history
  const handleSelectNextQuestion = (nextQ: string) => {
    setQuestion(nextQ);
    handleAnalyzeQuestion(nextQ);
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Header */}
      <Header onReset={handleReset} hasActiveExperiment={stage !== 'ask'} />

      {/* Progress Workflow Stepper */}
      <WorkflowStepper
        currentStage={stage}
        stagesCompleted={stagesCompleted}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6">
        {/* STAGE 01: ASK (Focused Centered Workspace) */}
        {stage === 'ask' && (
          <div className="max-w-3xl mx-auto py-8 sm:py-12 space-y-8 animate-fadeIn">
            <QuestionInput
              initialQuestion={question}
              onAnalyze={handleAnalyzeQuestion}
              isLoading={isAnalyzing}
              edgeCaseError={edgeCaseError}
            />

            {/* Optional Recent Sessions in ASK stage */}
            {history.length > 0 && (
              <div className="pt-4 border-t border-zinc-800">
                <RecentResearchDrawer
                  history={history}
                  onSelectHistory={(item) => handleSelectNextQuestion(item.question)}
                  onClearHistory={handleClearHistory}
                  className="w-full"
                />
              </div>
            )}
          </div>
        )}

        {/* STAGES 02-05: Multi-Column Execution Workspace */}
        {stage !== 'ask' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Center Stage Content */}
            <div className="lg:col-span-8 xl:col-span-9 space-y-8">
              {/* STAGE 02: CLARIFY */}
              {stage === 'clarify' && parsedQuestion && (
                <div key="clarify" className="animate-fadeIn">
                  <ClarificationPanel
                    parsedQuestion={parsedQuestion}
                    currentChoices={clarifications}
                    onConfirm={handleConfirmClarifications}
                    onBackToAsk={() => setStage('ask')}
                  />
                </div>
              )}

              {/* STAGE 03: DEFINE */}
              {stage === 'define' && experiment && parsedQuestion && (
                <div key="define" className="animate-fadeIn">
                  <ExperimentDefinition
                    experiment={experiment}
                    parsedQuestion={parsedQuestion}
                    clarifications={clarifications}
                    onRunExperiment={handleStartBacktest}
                    onEditAssumptions={() => setStage('clarify')}
                    onBackToClarify={() => setStage('clarify')}
                    isLoading={isTesting}
                  />
                </div>
              )}

              {/* STAGE 04: TEST */}
              {stage === 'test' && (
                <ExperimentProgress onComplete={handleBacktestAnimationComplete} />
              )}

              {/* STAGE 05: LEARN */}
              {stage === 'learn' && results && experiment && (
                <div className="space-y-8">
                  {/* Top Empirical Results Cards */}
                  <div className="animate-slideUp" style={{ animationDelay: '0ms' }}>
                    <ResultsSummary results={results} experiment={experiment} />
                  </div>

                  {/* 4 Professional Quantitative Recharts */}
                  <div className="animate-slideUp" style={{ animationDelay: '80ms' }}>
                    <ChartsView results={results} experiment={experiment} />
                  </div>

                  {/* Separated Learnings: Data vs Interpretation vs Prudent Conclusion */}
                  <div className="animate-slideUp" style={{ animationDelay: '160ms' }}>
                    <LearnSection results={results} experiment={experiment} />
                  </div>

                  {/* Institutional Research Caveats */}
                  <div className="animate-slideUp" style={{ animationDelay: '240ms' }}>
                    <ResearchWarnings />
                  </div>

                  {/* Actionable Follow-up Hypotheses */}
                  <div className="animate-slideUp" style={{ animationDelay: '320ms' }}>
                    <NextQuestions
                      experiment={experiment}
                      results={results}
                      onSelectQuestion={handleSelectNextQuestion}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Right Side: Persistent Experiment Context Panel */}
            <div className="lg:col-span-4 xl:col-span-3 sticky top-20 space-y-4">
              <ExperimentContextPanel
                question={question}
                parsedQuestion={parsedQuestion}
                clarifications={clarifications}
                experiment={experiment}
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-950 py-4 px-4 text-center text-xs text-zinc-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AI-Native Trading Research Assistant // Academic &amp; Quant Prototype</span>
          <span className="text-[11px] text-zinc-600">
            Deterministic Engine • Seeded PRNG • Strictly Non-Financial Advice
          </span>
        </div>
      </footer>
    </div>
  );
}
