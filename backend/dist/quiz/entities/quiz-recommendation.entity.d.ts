import { QuizResult } from './quiz-result.entity.js';
import { Product } from '../../products/entities/product.entity.js';
export declare class QuizRecommendation {
    id: string;
    resultId: string;
    result: QuizResult;
    productId: string;
    product: Product;
    sortOrder: number;
    reason: string;
}
