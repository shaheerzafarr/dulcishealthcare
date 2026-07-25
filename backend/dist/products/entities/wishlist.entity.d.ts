import { Product } from './product.entity.js';
import { User } from '../../users/entities/user.entity.js';
export declare class Wishlist {
    id: string;
    userId: string;
    user: User;
    productId: string;
    product: Product;
    createdAt: Date;
}
