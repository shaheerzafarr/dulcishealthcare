import { QuizQuestion } from './quiz-question.entity.js';
import { QuizResult } from './quiz-result.entity.js';
import { QuizAnswer } from './quiz-answer.entity.js';
export declare class Quiz {
    id: string;
    title: string;
    description: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    questions: QuizQuestion[];
    results: QuizResult[];
    answers: QuizAnswer[];
}
