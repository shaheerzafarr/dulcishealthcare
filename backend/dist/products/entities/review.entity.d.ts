import { Product } from './product.entity.js';
import { User } from '../../users/entities/user.entity.js';
export declare class Review {
    id: string;
    productId: string;
    product: Product;
    userId: string;
    user: User;
    orderId: string;
    rating: number;
    title: string;
    body: string;
    isVerified: boolean;
    isApproved: boolean;
    createdAt: Date;
    updatedAt: Date;
}
