import { Order } from './order.entity.js';
export declare class Invoice {
    id: string;
    orderId: string;
    order: Order;
    invoiceNumber: string;
    subtotal: number;
    taxAmount: number;
    taxBreakdown: any;
    shippingCost: number;
    discountAmount: number;
    total: number;
    pdfData: Buffer;
    pdfMime: string;
    issuedAt: Date;
    createdAt: Date;
}
