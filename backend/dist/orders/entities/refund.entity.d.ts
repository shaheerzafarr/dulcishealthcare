import { Order } from './order.entity.js';
import { Payment } from './payment.entity.js';
import { ReturnRequest } from './return-request.entity.js';
export declare class Refund {
    id: string;
    returnId: string;
    returnRequest: ReturnRequest;
    orderId: string;
    order: Order;
    paymentId: string;
    payment: Payment;
    amount: number;
    reason: string;
    status: string;
    refundedAt: Date;
    createdAt: Date;
}
