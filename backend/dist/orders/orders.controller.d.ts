import type { Response } from 'express';
import { OrdersService } from './orders.service.js';
import { CheckoutDto } from './dto/checkout.dto.js';
import { OrderStatusDto } from './dto/order-status.dto.js';
import { CreateReturnDto } from './dto/create-return.dto.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    checkout(user: any, dto: CheckoutDto): Promise<import("./entities/order.entity.js").Order>;
    getMyOrders(user: any, paginationDto: PaginationDto): Promise<{
        orders: import("./entities/order.entity.js").Order[];
        total: number;
        page: number;
        limit: number;
    }>;
    getMyOrder(user: any, id: string): Promise<import("./entities/order.entity.js").Order>;
    requestReturn(user: any, orderId: string, dto: CreateReturnDto, file?: Express.Multer.File): Promise<import("./entities/return-request.entity.js").ReturnRequest>;
    adminGetOrders(paginationDto: PaginationDto, status?: string): Promise<{
        orders: import("./entities/order.entity.js").Order[];
        total: number;
        page: number;
        limit: number;
    }>;
    adminGetOrder(id: string): Promise<import("./entities/order.entity.js").Order>;
    adminUpdateStatus(id: string, dto: OrderStatusDto, user: any): Promise<import("./entities/order.entity.js").Order>;
    adminUpdateTracking(id: string, trackingData: any): Promise<import("./entities/order.entity.js").Order>;
    adminUpdateNotes(id: string, notes: string): Promise<import("./entities/order.entity.js").Order>;
    adminCreateInvoice(orderId: string): Promise<import("./entities/invoice.entity.js").Invoice>;
    adminGetInvoices(): Promise<import("./entities/invoice.entity.js").Invoice[]>;
    serveInvoicePdf(invoiceId: string, res: Response): Promise<Response<any, Record<string, any>>>;
    adminGetReturns(): Promise<import("./entities/return-request.entity.js").ReturnRequest[]>;
    serveReturnProof(returnId: string, res: Response): Promise<Response<any, Record<string, any>>>;
    adminUpdateReturnStatus(id: string, status: string, adminNotes?: string): Promise<import("./entities/return-request.entity.js").ReturnRequest>;
    adminProcessRefund(id: string, amount: number, reason?: string, returnId?: string): Promise<import("./entities/refund.entity.js").Refund>;
    adminGetRefunds(): Promise<import("./entities/refund.entity.js").Refund[]>;
}
