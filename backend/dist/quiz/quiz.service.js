"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const quiz_entity_js_1 = require("./entities/quiz.entity.js");
const quiz_question_entity_js_1 = require("./entities/quiz-question.entity.js");
const quiz_option_entity_js_1 = require("./entities/quiz-option.entity.js");
const quiz_answer_entity_js_1 = require("./entities/quiz-answer.entity.js");
const quiz_result_entity_js_1 = require("./entities/quiz-result.entity.js");
const quiz_recommendation_entity_js_1 = require("./entities/quiz-recommendation.entity.js");
let QuizService = class QuizService {
    quizRepo;
    questionRepo;
    optionRepo;
    answerRepo;
    resultRepo;
    recRepo;
    constructor(quizRepo, questionRepo, optionRepo, answerRepo, resultRepo, recRepo) {
        this.quizRepo = quizRepo;
        this.questionRepo = questionRepo;
        this.optionRepo = optionRepo;
        this.answerRepo = answerRepo;
        this.resultRepo = resultRepo;
        this.recRepo = recRepo;
    }
    async getActiveQuiz() {
        const quiz = await this.quizRepo.findOne({
            where: { isActive: true },
            relations: {
                questions: {
                    options: true,
                },
            },
            order: {
                questions: {
                    sortOrder: 'ASC',
                    options: {
                        sortOrder: 'ASC',
                    },
                },
            },
        });
        if (!quiz)
            throw new common_1.NotFoundException('No active skin quiz found');
        return quiz;
    }
    async submitAnswers(userId, sessionId, answersDto) {
        const quiz = await this.getActiveQuiz();
        const selectedOptionIds = [];
        for (const ans of answersDto) {
            if (ans.optionIds && Array.isArray(ans.optionIds)) {
                selectedOptionIds.push(...ans.optionIds);
            }
            else if (ans.optionId) {
                selectedOptionIds.push(ans.optionId);
            }
        }
        if (selectedOptionIds.length === 0) {
            throw new common_1.BadRequestException('No answer choices were selected');
        }
        const submission = this.answerRepo.create({
            quizId: quiz.id,
            userId: userId || undefined,
            sessionId: sessionId || undefined,
            answers: answersDto,
        });
        await this.answerRepo.save(submission);
        const options = await this.optionRepo.find({
            where: { id: (0, typeorm_2.In)(selectedOptionIds) },
        });
        const scores = {};
        for (const opt of options) {
            if (opt.scoreTag) {
                scores[opt.scoreTag] = (scores[opt.scoreTag] || 0) + 1;
            }
        }
        let topConcern = 'general';
        let maxScore = 0;
        for (const [tag, score] of Object.entries(scores)) {
            if (score > maxScore) {
                maxScore = score;
                topConcern = tag;
            }
        }
        let result = await this.resultRepo.findOne({
            where: { quizId: quiz.id, resultKey: topConcern },
            relations: {
                recommendations: {
                    product: {
                        variants: {
                            inventory: true,
                        },
                    },
                },
            },
            order: {
                recommendations: {
                    sortOrder: 'ASC',
                },
            },
        });
        if (!result) {
            result = await this.resultRepo.findOne({
                where: { quizId: quiz.id },
                relations: {
                    recommendations: {
                        product: {
                            variants: {
                                inventory: true,
                            },
                        },
                    },
                },
                order: {
                    createdAt: 'ASC',
                },
            });
        }
        return {
            concern: topConcern,
            scores,
            result,
        };
    }
    async findAllQuizzes() {
        return this.quizRepo.find({ order: { createdAt: 'DESC' } });
    }
    async findQuizById(id) {
        const quiz = await this.quizRepo.findOne({ where: { id }, relations: { questions: { options: true } } });
        if (!quiz)
            throw new common_1.NotFoundException('Quiz definition not found');
        return quiz;
    }
    async createQuiz(dto) {
        const quiz = this.quizRepo.create(dto);
        return this.quizRepo.save(quiz);
    }
    async updateQuiz(id, dto) {
        const quiz = await this.findQuizById(id);
        Object.assign(quiz, dto);
        return this.quizRepo.save(quiz);
    }
    async deleteQuiz(id) {
        const quiz = await this.findQuizById(id);
        await this.quizRepo.remove(quiz);
    }
    async addQuestion(quizId, dto) {
        await this.findQuizById(quizId);
        const q = this.questionRepo.create({ ...dto, quizId });
        return this.questionRepo.save(q);
    }
    async updateQuestion(qId, dto) {
        const q = await this.questionRepo.findOne({ where: { id: qId } });
        if (!q)
            throw new common_1.NotFoundException('Quiz question not found');
        Object.assign(q, dto);
        return this.questionRepo.save(q);
    }
    async deleteQuestion(qId) {
        const q = await this.questionRepo.findOne({ where: { id: qId } });
        if (!q)
            throw new common_1.NotFoundException('Quiz question not found');
        await this.questionRepo.remove(q);
    }
    async addOption(qId, dto) {
        const q = await this.questionRepo.findOne({ where: { id: qId } });
        if (!q)
            throw new common_1.NotFoundException('Quiz question not found');
        const opt = this.optionRepo.create({ ...dto, questionId: qId });
        return this.optionRepo.save(opt);
    }
    async updateOption(oId, dto) {
        const opt = await this.optionRepo.findOne({ where: { id: oId } });
        if (!opt)
            throw new common_1.NotFoundException('Quiz option not found');
        Object.assign(opt, dto);
        return this.optionRepo.save(opt);
    }
    async deleteOption(oId) {
        const opt = await this.optionRepo.findOne({ where: { id: oId } });
        if (!opt)
            throw new common_1.NotFoundException('Quiz option not found');
        await this.optionRepo.remove(opt);
    }
    async getResults(quizId) {
        return this.resultRepo.find({
            where: { quizId },
            relations: { recommendations: { product: true } },
        });
    }
    async createResult(quizId, dto) {
        await this.findQuizById(quizId);
        const result = this.resultRepo.create({ ...dto, quizId });
        return this.resultRepo.save(result);
    }
    async updateResult(rId, dto) {
        const result = await this.resultRepo.findOne({ where: { id: rId } });
        if (!result)
            throw new common_1.NotFoundException('Quiz result not found');
        Object.assign(result, dto);
        return this.resultRepo.save(result);
    }
    async deleteResult(rId) {
        const result = await this.resultRepo.findOne({ where: { id: rId } });
        if (!result)
            throw new common_1.NotFoundException('Quiz result not found');
        await this.resultRepo.remove(result);
    }
    async addRecommendation(resultId, dto) {
        const result = await this.resultRepo.findOne({ where: { id: resultId } });
        if (!result)
            throw new common_1.NotFoundException('Quiz result not found');
        const rec = this.recRepo.create({ ...dto, resultId });
        return this.recRepo.save(rec);
    }
    async deleteRecommendation(recId) {
        const rec = await this.recRepo.findOne({ where: { id: recId } });
        if (!rec)
            throw new common_1.NotFoundException('Recommendation not found');
        await this.recRepo.remove(rec);
    }
    async getSubmissions(paginationDto) {
        const page = paginationDto.page || 1;
        const limit = paginationDto.limit || 10;
        const skip = (page - 1) * limit;
        const [submissions, total] = await this.answerRepo.findAndCount({
            order: { createdAt: 'DESC' },
            relations: { user: true },
            take: limit,
            skip,
        });
        return {
            submissions,
            total,
            page,
            limit,
        };
    }
    async getSubmissionStats() {
        const submissions = await this.answerRepo.find();
        const tally = {};
        let totalOptionsScored = 0;
        for (const sub of submissions) {
            const selectedOptionIds = [];
            const answersList = Array.isArray(sub.answers) ? sub.answers : [];
            for (const ans of answersList) {
                if (ans.optionIds && Array.isArray(ans.optionIds)) {
                    selectedOptionIds.push(...ans.optionIds);
                }
                else if (ans.optionId) {
                    selectedOptionIds.push(ans.optionId);
                }
            }
            if (selectedOptionIds.length > 0) {
                const options = await this.optionRepo.find({ where: { id: (0, typeorm_2.In)(selectedOptionIds) } });
                for (const opt of options) {
                    if (opt.scoreTag) {
                        tally[opt.scoreTag] = (tally[opt.scoreTag] || 0) + 1;
                        totalOptionsScored++;
                    }
                }
            }
        }
        const percentages = {};
        for (const [tag, count] of Object.entries(tally)) {
            percentages[tag] = totalOptionsScored > 0 ? Number((count / totalOptionsScored * 100).toFixed(1)) : 0;
        }
        return {
            totalSubmissions: submissions.length,
            totalOptionsScored,
            concernDistributionCounts: tally,
            concernDistributionPercentages: percentages,
        };
    }
};
exports.QuizService = QuizService;
exports.QuizService = QuizService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(quiz_entity_js_1.Quiz)),
    __param(1, (0, typeorm_1.InjectRepository)(quiz_question_entity_js_1.QuizQuestion)),
    __param(2, (0, typeorm_1.InjectRepository)(quiz_option_entity_js_1.QuizOption)),
    __param(3, (0, typeorm_1.InjectRepository)(quiz_answer_entity_js_1.QuizAnswer)),
    __param(4, (0, typeorm_1.InjectRepository)(quiz_result_entity_js_1.QuizResult)),
    __param(5, (0, typeorm_1.InjectRepository)(quiz_recommendation_entity_js_1.QuizRecommendation)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], QuizService);
//# sourceMappingURL=quiz.service.js.map