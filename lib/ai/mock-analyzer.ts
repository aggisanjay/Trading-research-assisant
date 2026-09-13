import { QuestionAnalyzer } from './analyzer';
import { ResearchQuestion } from '@/lib/types/research';

export class MockQuestionAnalyzer implements QuestionAnalyzer {
  async analyzeQuestion(rawQuestion: string): Promise<ResearchQuestion> {
    const q = rawQuestion.trim();
    const lower = q.toLowerCase();

    // Edge Case 1: Empty Question
    if (!q) {
      return {
        rawQuestion,
        instrument: null,
        timeframe: null,
        entryCondition: null,
        exitCondition: null,
        holdingPeriod: null,
        filters: [],
        hypothesis: null,
        missingInformation: ['Research question text'],
        assumptions: [],
        confidence: 0,
        parameterSources: {
          instrument: 'missing',
          entryThreshold: 'missing',
          holdingPeriod: 'missing',
          testPeriod: 'missing',
          exitCondition: 'missing',
          volatilityFilter: 'missing',
          costAssumption: 'missing',
        },
        edgeCase: {
          type: 'empty',
          message: 'Enter a research question to continue.',
        },
      };
    }

    // Edge Case 2: Very Vague Question
    const vaguePatterns = [
      /^what should i buy\??$/i,
      /^what to buy\??$/i,
      /^how to make money\??$/i,
      /^give me stock tips\??$/i,
      /^best strategy\??$/i,
      /^will market go up\??$/i,
      /^predict nifty\??$/i,
    ];
    if (vaguePatterns.some((pattern) => pattern.test(lower)) || lower.length < 10) {
      return {
        rawQuestion,
        instrument: null,
        timeframe: null,
        entryCondition: null,
        exitCondition: null,
        holdingPeriod: null,
        filters: [],
        hypothesis: null,
        missingInformation: [
          'Target instrument or market index',
          'Specific trigger event or quantitative entry condition',
          'Expected holding timeframe or measurable outcome',
        ],
        assumptions: [],
        confidence: 0.1,
        parameterSources: {
          instrument: 'missing',
          entryThreshold: 'missing',
          holdingPeriod: 'missing',
          testPeriod: 'missing',
          exitCondition: 'missing',
          volatilityFilter: 'missing',
          costAssumption: 'missing',
        },
        edgeCase: {
          type: 'too_vague',
          message:
            'This question is too broad to define a meaningful experiment. Please specify an instrument (e.g. NIFTY), an entry condition (e.g. 1% fall), and a measurable outcome.',
        },
      };
    }

    // Edge Case 3: Contradictory Inputs
    if (
      (lower.includes('sell before buy') ||
        lower.includes('exit before enter') ||
        lower.includes('sell before buying') ||
        (lower.includes('buy after') && lower.includes('sell before')))
    ) {
      return {
        rawQuestion,
        instrument: 'NIFTY 50',
        timeframe: 'Daily',
        entryCondition: 'Contradictory execution rule',
        exitCondition: 'Precedes entry',
        holdingPeriod: null,
        filters: [],
        hypothesis: null,
        missingInformation: ['Valid chronological execution sequence'],
        assumptions: [],
        confidence: 0.2,
        parameterSources: {
          instrument: 'inferred',
          entryThreshold: 'explicit',
          holdingPeriod: 'missing',
          testPeriod: 'assumed',
          exitCondition: 'explicit',
          volatilityFilter: 'assumed',
          costAssumption: 'assumed',
        },
        edgeCase: {
          type: 'contradictory_rules',
          message: 'These conditions conflict. The exit rule cannot precede or negate the entry trigger. Please review the sequence.',
        },
      };
    }

    // Instrument detection
    let instrument: string | null = null;
    let instrumentSource: 'explicit' | 'inferred' = 'inferred';
    let unsupportedNotice: string | undefined;

    if (lower.includes('nifty') || lower.includes('nifty 50') || lower.includes('nifty50')) {
      instrument = 'NIFTY 50';
      instrumentSource = 'explicit';
    } else if (lower.includes('banknifty') || lower.includes('sensex') || lower.includes('sp500') || lower.includes('s&p') || lower.includes('aapl') || lower.includes('btc') || lower.includes('bitcoin')) {
      const match = lower.includes('banknifty') ? 'BANKNIFTY' : lower.includes('sensex') ? 'SENSEX' : lower.includes('btc') ? 'Bitcoin' : 'Equity asset';
      instrument = 'NIFTY 50 (Fallback)';
      instrumentSource = 'inferred';
      unsupportedNotice = `You mentioned ${match}, but this prototype currently only demonstrates historical simulations using NIFTY 50 daily index data. We will calibrate this research experiment to NIFTY.`;
    } else {
      instrument = 'NIFTY 50';
      instrumentSource = 'inferred';
    }

    // Entry Threshold detection
    let entryThreshold: string | null = null;
    let entrySource: 'explicit' | 'assumed' = 'assumed';
    const missingInformation: string[] = [];
    const assumptions: string[] = [];

    const pctMatch = lower.match(/(\d+(?:\.\d+)?)\s*%\s*(?:fall|drop|decline|down|dip|crash)/);
    if (pctMatch) {
      entryThreshold = `Daily decline ≥ ${pctMatch[1]}%`;
      entrySource = 'explicit';
    } else if (lower.includes('sharp fall') || lower.includes('big fall') || lower.includes('crash') || lower.includes('heavy drop') || lower.includes('sharp decline')) {
      entryThreshold = 'Daily decline ≥ 1% (Subject to clarification)';
      entrySource = 'assumed';
      missingInformation.push('Quantitative definition of "sharp fall" (e.g. 1%, 2%, 3%, or percentile decline)');
      assumptions.push('"Sharp fall" is provisionally defaulted to a daily decline ≥ 1.0%');
    } else if (lower.includes('momentum') || lower.includes('rally')) {
      entryThreshold = 'Daily rise ≥ 1%';
      entrySource = 'assumed';
      missingInformation.push('Quantitative definition of momentum or entry threshold');
      assumptions.push('Momentum threshold provisionally defaulted to daily rise ≥ 1.0%');
    } else {
      entryThreshold = 'Daily decline ≥ 1%';
      entrySource = 'assumed';
      missingInformation.push('Quantitative entry trigger threshold');
      assumptions.push('Entry threshold provisionally defaulted to daily decline ≥ 1.0%');
    }

    // Holding Period detection
    let holdingPeriod: string | null = null;
    let holdingSource: 'explicit' | 'assumed' = 'assumed';
    const dayMatch = lower.match(/(\d+)\s*(?:day|trading day|session)/);
    if (dayMatch) {
      holdingPeriod = `${dayMatch[1]} trading day${parseInt(dayMatch[1], 10) > 1 ? 's' : ''}`;
      holdingSource = 'explicit';
    } else if (lower.includes('next day') || lower.includes('next-day') || lower.includes('overnight')) {
      holdingPeriod = '1 trading day';
      holdingSource = 'explicit';
    } else {
      holdingPeriod = '1 trading day';
      holdingSource = 'assumed';
      missingInformation.push('Position holding horizon (how many days to maintain the trade)');
      assumptions.push('Holding period is provisionally assumed to be 1 trading day (close-to-close)');
    }

    // Filters detection (e.g. Volatility)
    const filters: string[] = [];
    let volFilterSource: 'explicit' | 'assumed' = 'assumed';
    if (lower.includes('high vol') || lower.includes('high-volatility') || lower.includes('volatile') || lower.includes('volatility')) {
      filters.push('High Volatility Regime (Rolling 20d vol ≥ 75th percentile)');
      volFilterSource = 'explicit';
    } else {
      filters.push('All market regimes (No volatility filtering)');
      volFilterSource = 'assumed';
    }

    // Exit condition
    let exitCondition = 'Exit at next trading day close';
    let exitSource: 'explicit' | 'assumed' = 'assumed';
    if (lower.includes('trailing stop') || lower.includes('stop loss') || lower.includes('target')) {
      exitCondition = 'Target / Stop Exit';
      exitSource = 'explicit';
    } else {
      exitSource = 'assumed';
      assumptions.push('Exit condition defaults to market close at the end of the holding period');
    }

    // Hypothesis generation
    let hypothesis = '';
    if (lower.includes('volat')) {
      hypothesis = `Buying ${instrument} following a sharp daily decline during high-volatility regimes produces higher excess returns than in normal regimes.`;
    } else {
      hypothesis = `Buying ${instrument} after a significant daily decline produces an average next-day return superior to the unconditional baseline return.`;
    }

    // Default prototype assumptions to make visible
    assumptions.push('Test period defaulted to 5 years (approx. 1,250 trading sessions)');
    assumptions.push('Transaction costs and slippage defaulted to 0 bps for baseline demonstration');

    return {
      rawQuestion,
      instrument,
      timeframe: 'Daily',
      entryCondition: entryThreshold,
      exitCondition,
      holdingPeriod,
      filters,
      hypothesis,
      missingInformation,
      assumptions,
      confidence: entrySource === 'explicit' && instrumentSource === 'explicit' ? 0.92 : 0.76,
      parameterSources: {
        instrument: instrumentSource,
        entryThreshold: entrySource,
        holdingPeriod: holdingSource,
        testPeriod: 'assumed',
        exitCondition: exitSource,
        volatilityFilter: volFilterSource,
        costAssumption: 'assumed',
      },
      edgeCase: unsupportedNotice
        ? {
            type: 'unsupported_instrument',
            message: unsupportedNotice,
          }
        : undefined,
    };
  }
}
