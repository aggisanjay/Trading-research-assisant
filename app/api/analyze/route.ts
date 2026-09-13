import { NextRequest, NextResponse } from 'next/server';
import { AnalyzeRequestSchema } from '@/lib/validation/schemas';
import { OpenAIQuestionAnalyzer } from '@/lib/ai/openai-analyzer';

const analyzer = new OpenAIQuestionAnalyzer();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = AnalyzeRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const question = validation.data.question;
    const result = await analyzer.analyzeQuestion(question);

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('Error analyzing research question:', err);
    return NextResponse.json(
      { error: 'Internal analysis error', message: err?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
