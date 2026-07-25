import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { QuizResult } from './quiz-result.entity.js';
import { Product } from '../../products/entities/product.entity.js';

@Entity('quiz_recommendations')
export class QuizRecommendation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'result_id' })
  resultId: string;

  @ManyToOne(() => QuizResult, (result) => result.recommendations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'result_id' })
  result: QuizResult;

  @Column({ name: 'product_id' })
  productId: string;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ type: 'text', nullable: true })
  reason: string; // explanation for recommendation
}
