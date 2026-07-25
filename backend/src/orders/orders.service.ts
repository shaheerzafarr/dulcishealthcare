import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
import { ProductVariant } from '../products/entities/product-variant.entity.js';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private orderItemRepo: Repository<OrderItem>,
    @InjectRepository(OrderStatusHistory) private historyRepo: Repository<OrderStatusHistory>,
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
    @InjectRepository(Transaction) private txnRepo: Repository<Transaction>,
    @InjectRepository(Invoice) private invoiceRepo: Repository<Invoice>,
    @InjectRepository(ReturnRequest) private returnRepo: Repository<ReturnRequest>,
    @InjectRepository(Refund) private refundRepo: Repository<Refund>,
    
    @Inject(forwardRef(() => ProductsService))
    private productsService: ProductsService,
    private shippingService: ShippingService,
    private dataSource: DataSource,
  ) {}

  // ==========================================
  // CHECKOUT PIPELINE
  // ==========================================

  async checkout(userId: string, dto: CheckoutDto): Promise<Order> {
    const cart = await this.productsService.getCart(userId, undefined);
    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('Shopping cart is empty');
    }

    const rate = await this.shippingService.findRateById(dto.shippingRateId);

    // Calculate subtotal and verify stock
    let subtotal = 0;
    const checkoutItems: any[] = [];

    // Use transaction to ensure stock reservation integrity
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const item of cart.items) {
        if (!item.variantId) {
          throw new BadRequestException(`Variant must be specified for product: ${item.product.name}`);
        }

        // Fetch fresh variant with inventory locks
        const variant = await queryRunner.manager.findOne(
          ProductVariant,
          { 
            where: { id: item.variantId },
            relations: { inventory: true, product: true }
          }
        ) as any;

        if (!variant || !variant.isActive || !variant.product.isActive) {
          throw new BadRequestException(`Product variant is no longer available: ${item.product.name}`);
        }

        const availableStock = variant.inventory.quantity - variant.inventory.reserved;
        if (item.quantity > availableStock) {
          throw new BadRequestException(`Insufficient stock for ${variant.product.name} (${variant.name}). Available: ${availableStock}`);
        }

        // Calculate item totals
        const unitPrice = Number(variant.price);
        const lineTotal = unitPrice * item.quantity;
        subtotal += lineTotal;

        checkoutItems.push({
          productId: variant.product.id,
          variantId: variant.id,
          productName: variant.product.name,
          variantName: variant.name,
          sku: variant.sku,
          unitPrice,
          quantity: item.quantity,
          lineTotal,
          inventoryRecord: variant.inventory,
        });
      }

      // Calculate taxes & shipping
      const taxPercent = await this.shippingService.calculateTaxRate(dto.shippingCountry || 'PK', dto.shippingState);
      const taxAmount = subtotal * taxPercent;
      const shippingCost = Number(rate.rate);

      // Handle simple coupons stub
      let discountAmount = 0;
      if (dto.couponCode) {
        const code = dto.couponCode.toUpperCase();
        if (code === 'WELCOME10') {
          discountAmount = subtotal * 0.10; // 10% discount
        } else if (code === 'SUMMER15') {
          discountAmount = subtotal * 0.15; // 15% discount
        }
      }

      const total = subtotal + shippingCost + taxAmount - discountAmount;
      const orderNumber = `DLC-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

      // Snapshot shipping & billing address
      const order = this.orderRepo.create({
        userId,
        orderNumber,
        status: 'pending',
        shippingName: dto.shippingName,
        shippingPhone: dto.shippingPhone,
        shippingLine1: dto.shippingLine1,
        shippingLine2: dto.shippingLine2,
        shippingCity: dto.shippingCity,
        shippingState: dto.shippingState,
        shippingPostal: dto.shippingPostal,
        shippingCountry: dto.shippingCountry,
        billingName: dto.billingSameAsShipping ? dto.shippingName : dto.billingName,
        billingLine1: dto.billingSameAsShipping ? dto.shippingLine1 : dto.billingLine1,
        billingCity: dto.billingSameAsShipping ? dto.shippingCity : dto.billingCity,
        billingState: dto.billingSameAsShipping ? dto.shippingState : dto.billingState,
        billingPostal: dto.billingSameAsShipping ? dto.shippingPostal : dto.billingPostal,
        billingCountry: dto.billingSameAsShipping ? dto.shippingCountry : dto.billingCountry,
        billingSameAsShipping: dto.billingSameAsShipping,
        subtotal,
        shippingCost,
        taxAmount,
        discountAmount,
        total,
        shippingRateId: rate.id,
        notes: dto.notes,
      });

      const savedOrder = await queryRunner.manager.save(Order, order);

      // Create line items and reserve stock
      for (const ci of checkoutItems) {
        const orderItem = this.orderItemRepo.create({
          orderId: savedOrder.id,
          productId: ci.productId,
          variantId: ci.variantId,
          productName: ci.productName,
          variantName: ci.variantName,
          sku: ci.sku,
          unitPrice: ci.unitPrice,
          quantity: ci.quantity,
          lineTotal: ci.lineTotal,
        });
        await queryRunner.manager.save(OrderItem, orderItem);

        // Reserve stock
        ci.inventoryRecord.reserved += ci.quantity;
        await queryRunner.manager.save('ProductInventory', ci.inventoryRecord);
      }

      // Create pending payment intent record
      const payment = this.paymentRepo.create({
        orderId: savedOrder.id,
        method: dto.paymentMethod,
        status: 'pending',
        amount: total,
      });
      await queryRunner.manager.save(Payment, payment);

      // Initialize status history
      const history = this.historyRepo.create({
        orderId: savedOrder.id,
        toStatus: 'pending',
        note: 'Order placed successfully.',
      });
      await queryRunner.manager.save(OrderStatusHistory, history);

      // Clear Cart
      await queryRunner.manager.delete('CartItem', { cartId: cart.id });

      await queryRunner.commitTransaction();

      // Return fully loaded order
      return this.findOne(savedOrder.id);

    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  // ==========================================
  // FULFILLMENT & LIFECYCLE
  // ==========================================

  async findAll(paginationDto: PaginationDto, status?: string) {
    const page = paginationDto.page || 1;
    const limit = paginationDto.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;

    const [orders, total] = await this.orderRepo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      relations: { items: true },
      take: limit,
      skip,
    });

    return {
      orders,
      total,
      page,
      limit,
    };
  }

  async findMyOrders(userId: string, paginationDto: PaginationDto) {
    const page = paginationDto.page || 1;
    const limit = paginationDto.limit || 10;
    const skip = (page - 1) * limit;

    const [orders, total] = await this.orderRepo.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      relations: { items: true },
      take: limit,
      skip,
    });

    return {
      orders,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: {
        items: true,
        statusHistory: true,
        payments: { transactions: true },
        invoices: true,
        returnRequests: true,
        refunds: true,
      },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateStatus(id: string, dto: OrderStatusDto, changedBy?: string): Promise<Order> {
    const order = await this.findOne(id);
    const oldStatus = order.status;
    const newStatus = dto.status;

    if (oldStatus === newStatus) return order;

    // TypeORM database transaction to manage stock transitions
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      order.status = newStatus;

      if (newStatus === 'delivered') {
        order.deliveredAt = new Date();
      }

      await queryRunner.manager.save(Order, order);

      // Handle stock reservation updates based on status transitions
      if (['packed', 'shipped'].includes(newStatus) && !['packed', 'shipped'].includes(oldStatus)) {
        // Order confirmed/shipped -> Deduct actual inventory stock, release reservation
        for (const item of order.items) {
          if (item.variantId) {
            const inventory = await queryRunner.manager.findOne('ProductInventory', {
              where: { variantId: item.variantId },
            }) as any;

            if (inventory) {
              inventory.quantity = Math.max(0, inventory.quantity - item.quantity);
              inventory.reserved = Math.max(0, inventory.reserved - item.quantity);
              await queryRunner.manager.save('ProductInventory', inventory);
            }
          }
        }
      } else if (newStatus === 'cancelled' && oldStatus !== 'cancelled') {
        // Cancelled -> Release reserved stock back to availability (if not already packed/shipped)
        if (!['packed', 'shipped', 'delivered'].includes(oldStatus)) {
          for (const item of order.items) {
            if (item.variantId) {
              const inventory = await queryRunner.manager.findOne('ProductInventory', {
                where: { variantId: item.variantId },
              }) as any;

              if (inventory) {
                inventory.reserved = Math.max(0, inventory.reserved - item.quantity);
                await queryRunner.manager.save('ProductInventory', inventory);
              }
            }
          }
        }
      }

      // Add status history audit
      const history = this.historyRepo.create({
        orderId: id,
        fromStatus: oldStatus,
        toStatus: newStatus,
        changedBy,
        note: dto.note,
      });
      await queryRunner.manager.save(OrderStatusHistory, history);

      await queryRunner.commitTransaction();
      return this.findOne(id);

    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async updateTracking(id: string, trackingData: any): Promise<Order> {
    const order = await this.findOne(id);
    if (trackingData.trackingNumber) order.trackingNumber = trackingData.trackingNumber;
    if (trackingData.courierName) order.courierName = trackingData.courierName;
    if (trackingData.estimatedDelivery) order.estimatedDelivery = new Date(trackingData.estimatedDelivery);
    return this.orderRepo.save(order);
  }

  async updateAdminNotes(id: string, notes: string): Promise<Order> {
    const order = await this.findOne(id);
    order.adminNotes = notes;
    return this.orderRepo.save(order);
  }

  // ==========================================
  // INVOICES (PDF binary BYTEA)
  // ==========================================

  async getInvoicePdf(invoiceId: string): Promise<{ data: Buffer; mime: string }> {
    const invoice = await this.invoiceRepo.findOne({ where: { id: invoiceId } });
    if (!invoice || !invoice.pdfData) throw new NotFoundException('PDF Invoice not found');
    return { data: invoice.pdfData, mime: invoice.pdfMime };
  }

  async createInvoice(orderId: string): Promise<Invoice> {
    const order = await this.findOne(orderId);
    
    // Check if invoice already exists
    const existing = await this.invoiceRepo.findOne({ where: { orderId } });
    if (existing) return existing;

    const invoiceNumber = `INV-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    // Simple JSON-formatted tax breakdown
    const taxBreakdown = [
      { name: 'Pakistan GST', rate: 0.17, amount: order.taxAmount }
    ];

    // Dummy PDF Buffer content
    const pdfData = Buffer.from(`DULCIS HEALTHCARE - INVOICE ${invoiceNumber}\nOrder ID: ${order.id}\nTotal PKR ${order.total}`);

    const invoice = this.invoiceRepo.create({
      orderId,
      invoiceNumber,
      subtotal: order.subtotal,
      taxAmount: order.taxAmount,
      taxBreakdown,
      shippingCost: order.shippingCost,
      discountAmount: order.discountAmount,
      total: order.total,
      pdfData,
    });

    return this.invoiceRepo.save(invoice);
  }

  async findAllInvoices(): Promise<Invoice[]> {
    return this.invoiceRepo.find({ order: { createdAt: 'DESC' } });
  }

  // ==========================================
  // RETURNS & REFUNDS (photo proof BYTEA)
  // ==========================================

  async requestReturn(userId: string, orderId: string, dto: CreateReturnDto, file?: Express.Multer.File): Promise<ReturnRequest> {
    const order = await this.findOne(orderId);
    if (order.userId !== userId) throw new BadRequestException('Unauthorized order access');
    if (order.status !== 'delivered') throw new BadRequestException('Returns are only allowed for delivered orders');

    // Prevent duplicate returns
    const existing = await this.returnRepo.findOne({ where: { orderId } });
    if (existing) throw new BadRequestException('Return request has already been filed for this order');

    const request = this.returnRepo.create({
      orderId,
      userId,
      reason: dto.reason,
      description: dto.description,
      imageData: file?.buffer || undefined,
      imageMime: file?.mimetype || undefined,
      status: 'requested',
    });

    return this.returnRepo.save(request);
  }

  async findReturnById(id: string): Promise<ReturnRequest> {
    const ret = await this.returnRepo.findOne({ where: { id }, relations: { order: true, user: true } });
    if (!ret) throw new NotFoundException('Return request not found');
    return ret;
  }

  async getReturnProofImage(returnId: string): Promise<{ data: Buffer; mime: string }> {
    const ret = await this.findReturnById(returnId);
    if (!ret.imageData) throw new NotFoundException('Proof photo not found');
    return { data: ret.imageData, mime: ret.imageMime || 'image/jpeg' };
  }

  async findAllReturns(): Promise<ReturnRequest[]> {
    return this.returnRepo.find({ order: { createdAt: 'DESC' }, relations: { order: true } });
  }

  async updateReturnStatus(id: string, status: string, adminNotes?: string): Promise<ReturnRequest> {
    const request = await this.findReturnById(id);
    request.status = status;
    if (adminNotes) request.adminNotes = adminNotes;
    if (['approved', 'rejected', 'refunded'].includes(status)) {
      request.resolvedAt = new Date();
    }
    const saved = await this.returnRepo.save(request);

    // If status is approved, trigger order status update automatically
    if (status === 'approved') {
      await this.updateStatus(request.orderId, { status: 'returned', note: 'Return request approved by administrator.' });
    }

    return saved;
  }

  async processRefund(orderId: string, amount: number, reason?: string, returnId?: string): Promise<Refund> {
    const order = await this.findOne(orderId);
    const payment = order.payments && order.payments[0] ? order.payments[0] : null;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const refund = this.refundRepo.create({
        orderId,
        returnId,
        paymentId: payment?.id || undefined,
        amount,
        reason,
        status: 'processed',
        refundedAt: new Date(),
      });

      const savedRefund = await queryRunner.manager.save(Refund, refund);

      // Create matching transaction record
      if (payment) {
        const txn = this.txnRepo.create({
          paymentId: payment.id,
          type: 'refund',
          amount,
          status: 'success',
        });
        await queryRunner.manager.save(Transaction, txn);

        payment.status = 'refunded';
        await queryRunner.manager.save(Payment, payment);
      }

      await queryRunner.commitTransaction();
      return savedRefund;

    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAllRefunds(): Promise<Refund[]> {
    return this.refundRepo.find({ order: { createdAt: 'DESC' } });
  }
}
