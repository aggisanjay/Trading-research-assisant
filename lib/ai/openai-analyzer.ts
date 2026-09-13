import { QuestionAnalyzer } from './analyzer';
import { ResearchQuestion } from '@/lib/types/research';
import { MockQuestionAnalyzer } from './mock-analyzer';

export class OpenAIQuestionAnalyzer implements QuestionAnalyzer {
  private fallbackAnalyzer = new MockQuestionAnalyzer();

  async analyzeQuestion(question: string): Promise<ResearchQuestion> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      // Graceful fallback to deterministic mock analyzer
      return this.fallbackAnalyzer.analyzeQuestion(question);
    }

    try {
      // In production, this calls OpenAI with response_format: { type: "json_object" }
      // Using node fetch to keep zero unnecessary vendor lock-in
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are a financial quantitative research assistant. Extract structured research parameters from a user question.
Return JSON strictly adhering to this schema:
{
  "rawQuestion": string,
  "instrument": string,
  "timeframe": string,
  "entryCondition": string,
  "exitCondition": string,
  "holdingPeriod": string,
  "filters": string[],
  "hypothesis": string,
  "missingInformation": string[],
  "assumptions": string[],
  "confidence": number,
  "parameterSources": {
    "instrument": "explicit" | "inferred" | "assumed",
    "entryThreshold": "explicit" | "inferred" | "assumed",
    "holdingPeriod": "explicit" | "inferred" | "assumed",
    "testPeriod": "assumed",
    "exitCondition": "explicit" | "inferred" | "assumed",
    "volatilityFilter": "explicit" | "inferred" | "assumed",
    "costAssumption": "assumed"
  }
}`,
            },
            {
              role: 'user',
              content: question,
            },
          ],
          response_format: { type: 'json_object' },
        }),
      });

      if (!response.ok) {
        console.warn('OpenAI API returned non-OK status, falling back to Mock Analyzer');
        return this.fallbackAnalyzer.analyzeQuestion(question);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        return this.fallbackAnalyzer.analyzeQuestion(question);
      }

      const parsed = JSON.parse(content) as ResearchQuestion;
      return parsed;
    } catch (err) {
      console.warn('OpenAI call failed, utilizing MockQuestionAnalyzer fallback:', err);
      return this.fallbackAnalyzer.analyzeQuestion(question);
    }
  }
}
