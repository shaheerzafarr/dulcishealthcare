import { Quiz } from './quiz.entity.js';
import { User } from '../../users/entities/user.entity.js';
export declare class QuizAnswer {
    id: string;
    quizId: string;
    quiz: Quiz;
    userId: string;
    user: User;
    sessionId: string;
    answers: any;
    createdAt: Date;
}
