import { Quiz } from './quiz.entity.js';
import { QuizRecommendation } from './quiz-recommendation.entity.js';
export declare class QuizResult {
    id: string;
    quizId: string;
    quiz: Quiz;
    resultKey: string;
    title: string;
    description: string;
    createdAt: Date;
    recommendations: QuizRecommendation[];
}
