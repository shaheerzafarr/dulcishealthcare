import { QuizQuestion } from './quiz-question.entity.js';
export declare class QuizOption {
    id: string;
    questionId: string;
    question: QuizQuestion;
    optionText: string;
    scoreTag: string;
    sortOrder: number;
}
