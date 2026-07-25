import { Order } from './order.entity.js';
import { User } from '../../users/entities/user.entity.js';
export declare class ReturnRequest {
    id: string;
    orderId: string;
    order: Order;
    userId: string;
    user: User;
    status: string;
    reason: string;
    description: string;
    imageData: Buffer;
    imageMime: string;
    adminNotes: string;
    resolvedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
