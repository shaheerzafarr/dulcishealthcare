import { Order } from './order.entity.js';
import { Transaction } from './transaction.entity.js';
export declare class Payment {
    id: string;
    orderId: string;
    order: Order;
    method: string;
    status: string;
    amount: number;
    currency: string;
    gatewayRef: string;
    gatewayResponse: any;
    paidAt: Date;
    createdAt: Date;
    updatedAt: Date;
    transactions: Transaction[];
}
