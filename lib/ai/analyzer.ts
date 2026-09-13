import { ResearchQuestion } from '@/lib/types/research';

export interface QuestionAnalyzer {
  analyzeQuestion(question: string): Promise<ResearchQuestion>;
}
