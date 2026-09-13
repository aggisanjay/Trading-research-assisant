export type ResearchStage = 'ask' | 'clarify' | 'define' | 'test' | 'learn';

export type ParameterSource = 'explicit' | 'inferred' | 'assumed' | 'missing';

export interface ResearchQuestion {
  rawQuestion: string;
  instrument: string | null;
  timeframe: string | null;
  entryCondition: string | null;
  exitCondition: string | null;
  holdingPeriod: string | null;
  filters: string[];
  hypothesis: string | null;
  missingInformation: string[];
  assumptions: string[];
  confidence: number;
  parameterSources: {
    instrument: ParameterSource;
    entryThreshold: ParameterSource;
    holdingPeriod: ParameterSource;
    testPeriod: ParameterSource;
    exitCondition: ParameterSource;
    volatilityFilter: ParameterSource;
    costAssumption: ParameterSource;
  };
  edgeCase?: {
    type: 'empty' | 'too_vague' | 'unsupported_instrument' | 'contradictory_rules' | 'none';
    message: string;
  };
}

export interface ClarificationChoices {
  entryThresholdPct: number;
  holdingPeriodDays: number;
  testPeriodYears: number;
  exitRule: 'holding_period' | 'custom_trailing';
  volatilityRegime: 'all' | 'high_volatility' | 'low_volatility';
  costBps: number;
}

export interface Experiment {
  id: string;
  question: string;
  aiInterpretation: string;
  instrument: string;
  timeframe: string;
  entryCondition: {
    type: string;
    threshold: number;
    description: string;
  };
  exitCondition: {
    type: string;
    description: string;
  };
  holdingPeriodDays: number;
  testPeriodYears: number;
  filters: string[];
  volatilityFilterDescription?: string;
  transactionCostBps: number;
  hypothesis: string;
  assumptions: string[];
  status: 'draft' | 'ready' | 'running' | 'complete';
  createdAt: string;
}

export interface DailyMarketBar {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  returnPct: number;
  volume: number;
  volatility20d: number;
  volatilityPercentile: number;
}

export interface BacktestTrade {
  id: string;
  entryDate: string;
  entryPrice: number;
  exitDate: string;
  exitPrice: number;
  holdingDays: number;
  grossReturn: number;
  netReturn: number;
  isWin: boolean;
  entryVolatilityRegime: 'normal' | 'high_volatility' | 'low_volatility';
}

export interface BacktestResult {
  totalObservations: number;
  qualifyingSignals: number;
  winRate: number;
  winningTradesCount: number;
  losingTradesCount: number;
  avgStrategyReturn: number;
  medianStrategyReturn: number;
  unconditionalBaselineReturn: number;
  estimatedEdge: number;
  strategyCumulativeReturn: number;
  baselineCumulativeReturn: number;
  maxDrawdown: number;
  profitFactor: number;
  trades: BacktestTrade[];
  equityCurve: {
    date: string;
    strategyEquity: number;
    baselineEquity: number;
    benchmarkPrice: number;
    hasSignal: boolean;
  }[];
  returnDistribution: {
    range: string;
    count: number;
    isPositive: boolean;
  }[];
  learnings: {
    dataShows: string;
    whatItMightMean: string;
    whatWeCanReasonablyConclude: string;
  };
}

export interface ResearchSession {
  stage: ResearchStage;
  question: string;
  parsedQuestion: ResearchQuestion | null;
  clarifications: ClarificationChoices;
  experiment: Experiment | null;
  results: BacktestResult | null;
  history: {
    id: string;
    question: string;
    timestamp: string;
    edge: number;
    signals: number;
  }[];
}
