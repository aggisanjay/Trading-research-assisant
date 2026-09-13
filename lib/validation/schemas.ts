import { z } from 'zod';

export const ParameterSourceEnum = z.enum(['explicit', 'inferred', 'assumed', 'missing']);

export const ResearchQuestionSchema = z.object({
  rawQuestion: z.string().min(1, "Question cannot be empty"),
  instrument: z.string().nullable(),
  timeframe: z.string().nullable(),
  entryCondition: z.string().nullable(),
  exitCondition: z.string().nullable(),
  holdingPeriod: z.string().nullable(),
  filters: z.array(z.string()),
  hypothesis: z.string().nullable(),
  missingInformation: z.array(z.string()),
  assumptions: z.array(z.string()),
  confidence: z.number().min(0).max(1),
  parameterSources: z.object({
    instrument: ParameterSourceEnum,
    entryThreshold: ParameterSourceEnum,
    holdingPeriod: ParameterSourceEnum,
    testPeriod: ParameterSourceEnum,
    exitCondition: ParameterSourceEnum,
    volatilityFilter: ParameterSourceEnum,
    costAssumption: ParameterSourceEnum,
  }),
  edgeCase: z
    .object({
      type: z.enum(['empty', 'too_vague', 'unsupported_instrument', 'contradictory_rules', 'none']),
      message: z.string(),
    })
    .optional(),
});

export const ClarificationChoicesSchema = z.object({
  entryThresholdPct: z.number().positive(),
  holdingPeriodDays: z.number().int().positive(),
  testPeriodYears: z.number().int().positive(),
  exitRule: z.enum(['holding_period', 'custom_trailing']),
  volatilityRegime: z.enum(['all', 'high_volatility', 'low_volatility']),
  costBps: z.number().nonnegative(),
});

export const ExperimentSchema = z.object({
  id: z.string(),
  question: z.string(),
  aiInterpretation: z.string(),
  instrument: z.string(),
  timeframe: z.string(),
  entryCondition: z.object({
    type: z.string(),
    threshold: z.number(),
    description: z.string(),
  }),
  exitCondition: z.object({
    type: z.string(),
    description: z.string(),
  }),
  holdingPeriodDays: z.number().int().positive(),
  testPeriodYears: z.number().int().positive(),
  filters: z.array(z.string()),
  volatilityFilterDescription: z.string().optional(),
  transactionCostBps: z.number(),
  hypothesis: z.string(),
  assumptions: z.array(z.string()),
  status: z.enum(['draft', 'ready', 'running', 'complete']),
  createdAt: z.string(),
});

export const AnalyzeRequestSchema = z.object({
  question: z.string().trim(),
});
