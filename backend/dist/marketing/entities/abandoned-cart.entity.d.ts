import { User } from '../../users/entities/user.entity.js';
import { Order } from '../../orders/entities/order.entity.js';
export declare class AbandonedCart {
    id: string;
    userId: string;
    user: User;
    email: string;
    cartData: any;
    cartTotal: number;
    recoveryEmailSent: boolean;
    recoveryEmailSentAt: Date;
    recovered: boolean;
    recoveredOrderId: string;
    recoveredOrder: Order;
    abandonedAt: Date;
    createdAt: Date;
}
