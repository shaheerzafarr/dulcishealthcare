import { JwtService } from '@nestjs/jwt';
import { QuizService } from './quiz.service.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';
export declare class QuizController {
    private readonly quizService;
    private readonly jwtService;
    constructor(quizService: QuizService, jwtService: JwtService);
    getActiveQuiz(): Promise<import("./entities/quiz.entity.js").Quiz>;
    submitQuiz(req: any, answers: any[], sessionId?: string): Promise<any>;
    adminGetQuizzes(): Promise<import("./entities/quiz.entity.js").Quiz[]>;
    adminCreateQuiz(dto: any): Promise<import("./entities/quiz.entity.js").Quiz>;
    adminGetQuiz(id: string): Promise<import("./entities/quiz.entity.js").Quiz>;
    adminUpdateQuiz(id: string, dto: any): Promise<import("./entities/quiz.entity.js").Quiz>;
    adminDeleteQuiz(id: string): Promise<void>;
    adminAddQuestion(quizId: string, dto: any): Promise<import("./entities/quiz-question.entity.js").QuizQuestion>;
    adminUpdateQuestion(qId: string, dto: any): Promise<import("./entities/quiz-question.entity.js").QuizQuestion>;
    adminDeleteQuestion(qId: string): Promise<void>;
    adminAddOption(qId: string, dto: any): Promise<import("./entities/quiz-option.entity.js").QuizOption>;
    adminUpdateOption(oId: string, dto: any): Promise<import("./entities/quiz-option.entity.js").QuizOption>;
    adminDeleteOption(oId: string): Promise<void>;
    adminGetResults(quizId: string): Promise<import("./entities/quiz-result.entity.js").QuizResult[]>;
    adminCreateResult(quizId: string, dto: any): Promise<import("./entities/quiz-result.entity.js").QuizResult>;
    adminUpdateResult(rId: string, dto: any): Promise<import("./entities/quiz-result.entity.js").QuizResult>;
    adminDeleteResult(rId: string): Promise<void>;
    adminAddRec(resultId: string, dto: any): Promise<import("./entities/quiz-recommendation.entity.js").QuizRecommendation>;
    adminDeleteRec(recId: string): Promise<void>;
    adminGetSubmissions(paginationDto: PaginationDto): Promise<{
        submissions: import("./entities/quiz-answer.entity.js").QuizAnswer[];
        total: number;
        page: number;
        limit: number;
    }>;
    adminGetStats(): Promise<any>;
}
