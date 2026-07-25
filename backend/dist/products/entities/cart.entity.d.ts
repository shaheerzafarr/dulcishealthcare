import { User } from '../../users/entities/user.entity.js';
import { CartItem } from './cart-item.entity.js';
export declare class Cart {
    id: string;
    userId: string;
    user: User;
    sessionId: string;
    createdAt: Date;
    updatedAt: Date;
    items: CartItem[];
}
