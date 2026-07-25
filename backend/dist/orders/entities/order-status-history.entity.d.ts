import { Order } from './order.entity.js';
import { User } from '../../users/entities/user.entity.js';
export declare class OrderStatusHistory {
    id: string;
    orderId: string;
    order: Order;
    fromStatus: string;
    toStatus: string;
    changedBy: string;
    user: User;
    note: string;
    createdAt: Date;
}
