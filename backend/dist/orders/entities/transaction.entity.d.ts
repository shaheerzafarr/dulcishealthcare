import { Payment } from './payment.entity.js';
export declare class Transaction {
    id: string;
    paymentId: string;
    payment: Payment;
    type: string;
    amount: number;
    status: string;
    gatewayTxnId: string;
    metadata: any;
    createdAt: Date;
}
