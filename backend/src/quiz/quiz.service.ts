import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial, In } from 'typeorm';
import { Quiz } from './entities/quiz.entity.js';
import { QuizQuestion } from './entities/quiz-question.entity.js';
import { QuizOption } from './entities/quiz-option.entity.js';
import { QuizAnswer } from './entities/quiz-answer.entity.js';
import { QuizResult } from './entities/quiz-result.entity.js';
import { QuizRecommendation } from './entities/quiz-recommendation.entity.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';

@Injectable()
export class QuizService {
  constructor(
    @InjectRepository(Quiz) private quizRepo: Repository<Quiz>,
    @InjectRepository(QuizQuestion) private questionRepo: Repository<QuizQuestion>,
    @InjectRepository(QuizOption) private optionRepo: Repository<QuizOption>,
    @InjectRepository(QuizAnswer) private answerRepo: Repository<QuizAnswer>,
    @InjectRepository(QuizResult) private resultRepo: Repository<QuizResult>,
    @InjectRepository(QuizRecommendation) private recRepo: Repository<QuizRecommendation>,
  ) {}

  // ==========================================
  // SHOPPER QUIZ ACTIONS
  // ==========================================

  async getActiveQuiz(): Promise<Quiz> {
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

    if (!quiz) throw new NotFoundException('No active skin quiz found');
    return quiz;
  }

  async submitAnswers(userId: string | null, sessionId: string | null, answersDto: any[]): Promise<any> {
    const quiz = await this.getActiveQuiz();

    // Map selected option IDs to lookup score tags
    const selectedOptionIds: string[] = [];
    for (const ans of answersDto) {
      if (ans.optionIds && Array.isArray(ans.optionIds)) {
        selectedOptionIds.push(...ans.optionIds);
      } else if (ans.optionId) {
        selectedOptionIds.push(ans.optionId);
      }
    }

    if (selectedOptionIds.length === 0) {
      throw new BadRequestException('No answer choices were selected');
    }

    // Save answer record
    const submission = this.answerRepo.create({
      quizId: quiz.id,
      userId: userId || undefined,
      sessionId: sessionId || undefined,
      answers: answersDto,
    });
    await this.answerRepo.save(submission);

    // Score selected options
    const options = await this.optionRepo.find({
      where: { id: In(selectedOptionIds) },
    });

    const scores: Record<string, number> = {};
    for (const opt of options) {
      if (opt.scoreTag) {
        scores[opt.scoreTag] = (scores[opt.scoreTag] || 0) + 1;
      }
    }

    // Determine highest score skin concern tag
    let topConcern = 'general';
    let maxScore = 0;
    for (const [tag, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        topConcern = tag;
      }
    }

    // Retrieve matching result and recommended products
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

    // Fallback if no tag matches
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

  // ==========================================
  // ADMINISTRATIVE CRUD ACTIONS
  // ==========================================

  // --- Quiz definitions ---
  async findAllQuizzes(): Promise<Quiz[]> {
    return this.quizRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findQuizById(id: string): Promise<Quiz> {
    const quiz = await this.quizRepo.findOne({ where: { id }, relations: { questions: { options: true } } });
    if (!quiz) throw new NotFoundException('Quiz definition not found');
    return quiz;
  }

  async createQuiz(dto: any): Promise<Quiz> {
    const quiz = this.quizRepo.create(dto as DeepPartial<Quiz>);
    return this.quizRepo.save(quiz);
  }

  async updateQuiz(id: string, dto: any): Promise<Quiz> {
    const quiz = await this.findQuizById(id);
    Object.assign(quiz, dto);
    return this.quizRepo.save(quiz);
  }

  async deleteQuiz(id: string): Promise<void> {
    const quiz = await this.findQuizById(id);
    await this.quizRepo.remove(quiz);
  }

  // --- Questions ---
  async addQuestion(quizId: string, dto: any): Promise<QuizQuestion> {
    await this.findQuizById(quizId);
    const q = this.questionRepo.create({ ...dto, quizId } as DeepPartial<QuizQuestion>);
    return this.questionRepo.save(q);
  }

  async updateQuestion(qId: string, dto: any): Promise<QuizQuestion> {
    const q = await this.questionRepo.findOne({ where: { id: qId } });
    if (!q) throw new NotFoundException('Quiz question not found');
    Object.assign(q, dto);
    return this.questionRepo.save(q);
  }

  async deleteQuestion(qId: string): Promise<void> {
    const q = await this.questionRepo.findOne({ where: { id: qId } });
    if (!q) throw new NotFoundException('Quiz question not found');
    await this.questionRepo.remove(q);
  }

  // --- Options ---
  async addOption(qId: string, dto: any): Promise<QuizOption> {
    const q = await this.questionRepo.findOne({ where: { id: qId } });
    if (!q) throw new NotFoundException('Quiz question not found');
    const opt = this.optionRepo.create({ ...dto, questionId: qId } as DeepPartial<QuizOption>);
    return this.optionRepo.save(opt);
  }

  async updateOption(oId: string, dto: any): Promise<QuizOption> {
    const opt = await this.optionRepo.findOne({ where: { id: oId } });
    if (!opt) throw new NotFoundException('Quiz option not found');
    Object.assign(opt, dto);
    return this.optionRepo.save(opt);
  }

  async deleteOption(oId: string): Promise<void> {
    const opt = await this.optionRepo.findOne({ where: { id: oId } });
    if (!opt) throw new NotFoundException('Quiz option not found');
    await this.optionRepo.remove(opt);
  }

  // --- Results mapping ---
  async getResults(quizId: string): Promise<QuizResult[]> {
    return this.resultRepo.find({
      where: { quizId },
      relations: { recommendations: { product: true } },
    });
  }

  async createResult(quizId: string, dto: any): Promise<QuizResult> {
    await this.findQuizById(quizId);
    const result = this.resultRepo.create({ ...dto, quizId } as DeepPartial<QuizResult>);
    return this.resultRepo.save(result);
  }

  async updateResult(rId: string, dto: any): Promise<QuizResult> {
    const result = await this.resultRepo.findOne({ where: { id: rId } });
    if (!result) throw new NotFoundException('Quiz result not found');
    Object.assign(result, dto);
    return this.resultRepo.save(result);
  }

  async deleteResult(rId: string): Promise<void> {
    const result = await this.resultRepo.findOne({ where: { id: rId } });
    if (!result) throw new NotFoundException('Quiz result not found');
    await this.resultRepo.remove(result);
  }

  // --- Recommendations ---
  async addRecommendation(resultId: string, dto: any): Promise<QuizRecommendation> {
    const result = await this.resultRepo.findOne({ where: { id: resultId } });
    if (!result) throw new NotFoundException('Quiz result not found');
    const rec = this.recRepo.create({ ...dto, resultId } as DeepPartial<QuizRecommendation>);
    return this.recRepo.save(rec);
  }

  async deleteRecommendation(recId: string): Promise<void> {
    const rec = await this.recRepo.findOne({ where: { id: recId } });
    if (!rec) throw new NotFoundException('Recommendation not found');
    await this.recRepo.remove(rec);
  }

  // --- Analytics & Responses ---
  async getSubmissions(paginationDto: PaginationDto) {
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

  async getSubmissionStats(): Promise<any> {
    const submissions = await this.answerRepo.find();
    
    // Perform analytics on raw score tag counts
    const tally: Record<string, number> = {};
    let totalOptionsScored = 0;

    for (const sub of submissions) {
      const selectedOptionIds: string[] = [];
      const answersList = Array.isArray(sub.answers) ? sub.answers : [];
      for (const ans of answersList) {
        if (ans.optionIds && Array.isArray(ans.optionIds)) {
          selectedOptionIds.push(...ans.optionIds);
        } else if (ans.optionId) {
          selectedOptionIds.push(ans.optionId);
        }
      }

      if (selectedOptionIds.length > 0) {
        const options = await this.optionRepo.find({ where: { id: In(selectedOptionIds) } });
        for (const opt of options) {
          if (opt.scoreTag) {
            tally[opt.scoreTag] = (tally[opt.scoreTag] || 0) + 1;
            totalOptionsScored++;
          }
        }
      }
    }

    const percentages: Record<string, number> = {};
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
}
