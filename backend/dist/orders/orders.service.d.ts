import { Repository, DataSource } from 'typeorm';
import { Order } from './entities/order.entity.js';
import { OrderItem } from './entities/order-item.entity.js';
import { OrderStatusHistory } from './entities/order-status-history.entity.js';
import { Payment } from './entities/payment.entity.js';
import { Transaction } from './entities/transaction.entity.js';
import { Invoice } from './entities/invoice.entity.js';
import { ReturnRequest } from './entities/return-request.entity.js';
import { Refund } from './entities/refund.entity.js';
import { CheckoutDto } from './dto/checkout.dto.js';
import { OrderStatusDto } from './dto/order-status.dto.js';
import { CreateReturnDto } from './dto/create-return.dto.js';
import { ProductsService } from '../products/products.service.js';
import { ShippingService } from '../shipping/shipping.service.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';
export declare class OrdersService {
    private orderRepo;
    private orderItemRepo;
    private historyRepo;
    private paymentRepo;
    private txnRepo;
    private invoiceRepo;
    private returnRepo;
    private refundRepo;
    private productsService;
    private shippingService;
    private dataSource;
    constructor(orderRepo: Repository<Order>, orderItemRepo: Repository<OrderItem>, historyRepo: Repository<OrderStatusHistory>, paymentRepo: Repository<Payment>, txnRepo: Repository<Transaction>, invoiceRepo: Repository<Invoice>, returnRepo: Repository<ReturnRequest>, refundRepo: Repository<Refund>, productsService: ProductsService, shippingService: ShippingService, dataSource: DataSource);
    checkout(userId: string, dto: CheckoutDto): Promise<Order>;
    findAll(paginationDto: PaginationDto, status?: string): Promise<{
        orders: Order[];
        total: number;
        page: number;
        limit: number;
    }>;
    findMyOrders(userId: string, paginationDto: PaginationDto): Promise<{
        orders: Order[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<Order>;
    updateStatus(id: string, dto: OrderStatusDto, changedBy?: string): Promise<Order>;
    updateTracking(id: string, trackingData: any): Promise<Order>;
    updateAdminNotes(id: string, notes: string): Promise<Order>;
    getInvoicePdf(invoiceId: string): Promise<{
        data: Buffer;
        mime: string;
    }>;
    createInvoice(orderId: string): Promise<Invoice>;
    findAllInvoices(): Promise<Invoice[]>;
    requestReturn(userId: string, orderId: string, dto: CreateReturnDto, file?: Express.Multer.File): Promise<ReturnRequest>;
    findReturnById(id: string): Promise<ReturnRequest>;
    getReturnProofImage(returnId: string): Promise<{
        data: Buffer;
        mime: string;
    }>;
    findAllReturns(): Promise<ReturnRequest[]>;
    updateReturnStatus(id: string, status: string, adminNotes?: string): Promise<ReturnRequest>;
    processRefund(orderId: string, amount: number, reason?: string, returnId?: string): Promise<Refund>;
    findAllRefunds(): Promise<Refund[]>;
}
