"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_js_1 = require("./entities/order.entity.js");
const order_item_entity_js_1 = require("./entities/order-item.entity.js");
const order_status_history_entity_js_1 = require("./entities/order-status-history.entity.js");
const payment_entity_js_1 = require("./entities/payment.entity.js");
const transaction_entity_js_1 = require("./entities/transaction.entity.js");
const invoice_entity_js_1 = require("./entities/invoice.entity.js");
const return_request_entity_js_1 = require("./entities/return-request.entity.js");
const refund_entity_js_1 = require("./entities/refund.entity.js");
const products_service_js_1 = require("../products/products.service.js");
const shipping_service_js_1 = require("../shipping/shipping.service.js");
const product_variant_entity_js_1 = require("../products/entities/product-variant.entity.js");
let OrdersService = class OrdersService {
    orderRepo;
    orderItemRepo;
    historyRepo;
    paymentRepo;
    txnRepo;
    invoiceRepo;
    returnRepo;
    refundRepo;
    productsService;
    shippingService;
    dataSource;
    constructor(orderRepo, orderItemRepo, historyRepo, paymentRepo, txnRepo, invoiceRepo, returnRepo, refundRepo, productsService, shippingService, dataSource) {
        this.orderRepo = orderRepo;
        this.orderItemRepo = orderItemRepo;
        this.historyRepo = historyRepo;
        this.paymentRepo = paymentRepo;
        this.txnRepo = txnRepo;
        this.invoiceRepo = invoiceRepo;
        this.returnRepo = returnRepo;
        this.refundRepo = refundRepo;
        this.productsService = productsService;
        this.shippingService = shippingService;
        this.dataSource = dataSource;
    }
    async checkout(userId, dto) {
        const cart = await this.productsService.getCart(userId, undefined);
        if (!cart.items || cart.items.length === 0) {
            throw new common_1.BadRequestException('Shopping cart is empty');
        }
        const rate = await this.shippingService.findRateById(dto.shippingRateId);
        let subtotal = 0;
        const checkoutItems = [];
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            for (const item of cart.items) {
                if (!item.variantId) {
                    throw new common_1.BadRequestException(`Variant must be specified for product: ${item.product.name}`);
                }
                const variant = await queryRunner.manager.findOne(product_variant_entity_js_1.ProductVariant, {
                    where: { id: item.variantId },
                    relations: { inventory: true, product: true }
                });
                if (!variant || !variant.isActive || !variant.product.isActive) {
                    throw new common_1.BadRequestException(`Product variant is no longer available: ${item.product.name}`);
                }
                const availableStock = variant.inventory.quantity - variant.inventory.reserved;
                if (item.quantity > availableStock) {
                    throw new common_1.BadRequestException(`Insufficient stock for ${variant.product.name} (${variant.name}). Available: ${availableStock}`);
                }
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
            const taxPercent = await this.shippingService.calculateTaxRate(dto.shippingCountry || 'PK', dto.shippingState);
            const taxAmount = subtotal * taxPercent;
            const shippingCost = Number(rate.rate);
            let discountAmount = 0;
            if (dto.couponCode) {
                const code = dto.couponCode.toUpperCase();
                if (code === 'WELCOME10') {
                    discountAmount = subtotal * 0.10;
                }
                else if (code === 'SUMMER15') {
                    discountAmount = subtotal * 0.15;
                }
            }
            const total = subtotal + shippingCost + taxAmount - discountAmount;
            const orderNumber = `DLC-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
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
            const savedOrder = await queryRunner.manager.save(order_entity_js_1.Order, order);
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
                await queryRunner.manager.save(order_item_entity_js_1.OrderItem, orderItem);
                ci.inventoryRecord.reserved += ci.quantity;
                await queryRunner.manager.save('ProductInventory', ci.inventoryRecord);
            }
            const payment = this.paymentRepo.create({
                orderId: savedOrder.id,
                method: dto.paymentMethod,
                status: 'pending',
                amount: total,
            });
            await queryRunner.manager.save(payment_entity_js_1.Payment, payment);
            const history = this.historyRepo.create({
                orderId: savedOrder.id,
                toStatus: 'pending',
                note: 'Order placed successfully.',
            });
            await queryRunner.manager.save(order_status_history_entity_js_1.OrderStatusHistory, history);
            await queryRunner.manager.delete('CartItem', { cartId: cart.id });
            await queryRunner.commitTransaction();
            return this.findOne(savedOrder.id);
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async findAll(paginationDto, status) {
        const page = paginationDto.page || 1;
        const limit = paginationDto.limit || 10;
        const skip = (page - 1) * limit;
        const where = {};
        if (status)
            where.status = status;
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
    async findMyOrders(userId, paginationDto) {
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
    async findOne(id) {
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
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return order;
    }
    async updateStatus(id, dto, changedBy) {
        const order = await this.findOne(id);
        const oldStatus = order.status;
        const newStatus = dto.status;
        if (oldStatus === newStatus)
            return order;
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            order.status = newStatus;
            if (newStatus === 'delivered') {
                order.deliveredAt = new Date();
            }
            await queryRunner.manager.save(order_entity_js_1.Order, order);
            if (['packed', 'shipped'].includes(newStatus) && !['packed', 'shipped'].includes(oldStatus)) {
                for (const item of order.items) {
                    if (item.variantId) {
                        const inventory = await queryRunner.manager.findOne('ProductInventory', {
                            where: { variantId: item.variantId },
                        });
                        if (inventory) {
                            inventory.quantity = Math.max(0, inventory.quantity - item.quantity);
                            inventory.reserved = Math.max(0, inventory.reserved - item.quantity);
                            await queryRunner.manager.save('ProductInventory', inventory);
                        }
                    }
                }
            }
            else if (newStatus === 'cancelled' && oldStatus !== 'cancelled') {
                if (!['packed', 'shipped', 'delivered'].includes(oldStatus)) {
                    for (const item of order.items) {
                        if (item.variantId) {
                            const inventory = await queryRunner.manager.findOne('ProductInventory', {
                                where: { variantId: item.variantId },
                            });
                            if (inventory) {
                                inventory.reserved = Math.max(0, inventory.reserved - item.quantity);
                                await queryRunner.manager.save('ProductInventory', inventory);
                            }
                        }
                    }
                }
            }
            const history = this.historyRepo.create({
                orderId: id,
                fromStatus: oldStatus,
                toStatus: newStatus,
                changedBy,
                note: dto.note,
            });
            await queryRunner.manager.save(order_status_history_entity_js_1.OrderStatusHistory, history);
            await queryRunner.commitTransaction();
            return this.findOne(id);
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async updateTracking(id, trackingData) {
        const order = await this.findOne(id);
        if (trackingData.trackingNumber)
            order.trackingNumber = trackingData.trackingNumber;
        if (trackingData.courierName)
            order.courierName = trackingData.courierName;
        if (trackingData.estimatedDelivery)
            order.estimatedDelivery = new Date(trackingData.estimatedDelivery);
        return this.orderRepo.save(order);
    }
    async updateAdminNotes(id, notes) {
        const order = await this.findOne(id);
        order.adminNotes = notes;
        return this.orderRepo.save(order);
    }
    async getInvoicePdf(invoiceId) {
        const invoice = await this.invoiceRepo.findOne({ where: { id: invoiceId } });
        if (!invoice || !invoice.pdfData)
            throw new common_1.NotFoundException('PDF Invoice not found');
        return { data: invoice.pdfData, mime: invoice.pdfMime };
    }
    async createInvoice(orderId) {
        const order = await this.findOne(orderId);
        const existing = await this.invoiceRepo.findOne({ where: { orderId } });
        if (existing)
            return existing;
        const invoiceNumber = `INV-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
        const taxBreakdown = [
            { name: 'Pakistan GST', rate: 0.17, amount: order.taxAmount }
        ];
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
    async findAllInvoices() {
        return this.invoiceRepo.find({ order: { createdAt: 'DESC' } });
    }
    async requestReturn(userId, orderId, dto, file) {
        const order = await this.findOne(orderId);
        if (order.userId !== userId)
            throw new common_1.BadRequestException('Unauthorized order access');
        if (order.status !== 'delivered')
            throw new common_1.BadRequestException('Returns are only allowed for delivered orders');
        const existing = await this.returnRepo.findOne({ where: { orderId } });
        if (existing)
            throw new common_1.BadRequestException('Return request has already been filed for this order');
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
    async findReturnById(id) {
        const ret = await this.returnRepo.findOne({ where: { id }, relations: { order: true, user: true } });
        if (!ret)
            throw new common_1.NotFoundException('Return request not found');
        return ret;
    }
    async getReturnProofImage(returnId) {
        const ret = await this.findReturnById(returnId);
        if (!ret.imageData)
            throw new common_1.NotFoundException('Proof photo not found');
        return { data: ret.imageData, mime: ret.imageMime || 'image/jpeg' };
    }
    async findAllReturns() {
        return this.returnRepo.find({ order: { createdAt: 'DESC' }, relations: { order: true } });
    }
    async updateReturnStatus(id, status, adminNotes) {
        const request = await this.findReturnById(id);
        request.status = status;
        if (adminNotes)
            request.adminNotes = adminNotes;
        if (['approved', 'rejected', 'refunded'].includes(status)) {
            request.resolvedAt = new Date();
        }
        const saved = await this.returnRepo.save(request);
        if (status === 'approved') {
            await this.updateStatus(request.orderId, { status: 'returned', note: 'Return request approved by administrator.' });
        }
        return saved;
    }
    async processRefund(orderId, amount, reason, returnId) {
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
            const savedRefund = await queryRunner.manager.save(refund_entity_js_1.Refund, refund);
            if (payment) {
                const txn = this.txnRepo.create({
                    paymentId: payment.id,
                    type: 'refund',
                    amount,
                    status: 'success',
                });
                await queryRunner.manager.save(transaction_entity_js_1.Transaction, txn);
                payment.status = 'refunded';
                await queryRunner.manager.save(payment_entity_js_1.Payment, payment);
            }
            await queryRunner.commitTransaction();
            return savedRefund;
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async findAllRefunds() {
        return this.refundRepo.find({ order: { createdAt: 'DESC' } });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_js_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_item_entity_js_1.OrderItem)),
    __param(2, (0, typeorm_1.InjectRepository)(order_status_history_entity_js_1.OrderStatusHistory)),
    __param(3, (0, typeorm_1.InjectRepository)(payment_entity_js_1.Payment)),
    __param(4, (0, typeorm_1.InjectRepository)(transaction_entity_js_1.Transaction)),
    __param(5, (0, typeorm_1.InjectRepository)(invoice_entity_js_1.Invoice)),
    __param(6, (0, typeorm_1.InjectRepository)(return_request_entity_js_1.ReturnRequest)),
    __param(7, (0, typeorm_1.InjectRepository)(refund_entity_js_1.Refund)),
    __param(8, (0, common_1.Inject)((0, common_1.forwardRef)(() => products_service_js_1.ProductsService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        products_service_js_1.ProductsService,
        shipping_service_js_1.ShippingService,
        typeorm_2.DataSource])
], OrdersService);
//# sourceMappingURL=orders.service.js.map