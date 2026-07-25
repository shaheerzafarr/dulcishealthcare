import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Quiz } from './entities/quiz.entity.js';
import { QuizQuestion } from './entities/quiz-question.entity.js';
import { QuizOption } from './entities/quiz-option.entity.js';
import { QuizAnswer } from './entities/quiz-answer.entity.js';
import { QuizResult } from './entities/quiz-result.entity.js';
import { QuizRecommendation } from './entities/quiz-recommendation.entity.js';
import { QuizService } from './quiz.service.js';
import { QuizController } from './quiz.controller.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Quiz,
      QuizQuestion,
      QuizOption,
      QuizAnswer,
      QuizResult,
      QuizRecommendation,
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: configService.get<any>('jwt.expiresIn'),
        },
      }),
    }),
  ],
  providers: [QuizService],
  controllers: [QuizController],
  exports: [QuizService],
})
export class QuizModule {}
