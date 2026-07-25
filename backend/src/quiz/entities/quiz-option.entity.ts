import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { QuizQuestion } from './quiz-question.entity.js';

@Entity('quiz_options')
export class QuizOption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'question_id' })
  questionId: string;

  @ManyToOne(() => QuizQuestion, (question) => question.options, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'question_id' })
  question: QuizQuestion;

  @Column({ name: 'option_text', length: 255 })
  optionText: string;

  @Column({ name: 'score_tag', length: 50, nullable: true })
  scoreTag: string; // 'acne', 'dryness', 'aging' - tag matched for scores

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;
}
