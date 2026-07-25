import { Quiz } from './quiz.entity.js';
import { QuizOption } from './quiz-option.entity.js';
export declare class QuizQuestion {
    id: string;
    quizId: string;
    quiz: Quiz;
    questionText: string;
    questionType: string;
    sortOrder: number;
    createdAt: Date;
    options: QuizOption[];
}
