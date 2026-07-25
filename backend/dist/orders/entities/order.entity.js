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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const typeorm_1 = require("typeorm");
const user_entity_js_1 = require("../../users/entities/user.entity.js");
const shipping_rate_entity_js_1 = require("../../shipping/entities/shipping-rate.entity.js");
const order_item_entity_js_1 = require("./order-item.entity.js");
const order_status_history_entity_js_1 = require("./order-status-history.entity.js");
const payment_entity_js_1 = require("./payment.entity.js");
const invoice_entity_js_1 = require("./invoice.entity.js");
const return_request_entity_js_1 = require("./return-request.entity.js");
const refund_entity_js_1 = require("./refund.entity.js");
let Order = class Order {
    id;
    userId;
    user;
    orderNumber;
    status;
    shippingName;
    shippingPhone;
    shippingLine1;
    shippingLine2;
    shippingCity;
    shippingState;
    shippingPostal;
    shippingCountry;
    billingName;
    billingLine1;
    billingCity;
    billingState;
    billingPostal;
    billingCountry;
    billingSameAsShipping;
    subtotal;
    shippingCost;
    taxAmount;
    discountAmount;
    total;
    couponId;
    shippingRateId;
    shippingRate;
    trackingNumber;
    courierName;
    estimatedDelivery;
    deliveredAt;
    notes;
    adminNotes;
    createdAt;
    updatedAt;
    items;
    statusHistory;
    payments;
    invoices;
    returnRequests;
    refunds;
};
exports.Order = Order;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Order.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_js_1.User, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_js_1.User)
], Order.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_number', unique: true, length: 30 }),
    __metadata("design:type", String)
], Order.prototype, "orderNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 30, default: 'pending' }),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shipping_name', length: 200 }),
    __metadata("design:type", String)
], Order.prototype, "shippingName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shipping_phone', length: 30, nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "shippingPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shipping_line1', length: 255 }),
    __metadata("design:type", String)
], Order.prototype, "shippingLine1", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shipping_line2', length: 255, nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "shippingLine2", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shipping_city', length: 100 }),
    __metadata("design:type", String)
], Order.prototype, "shippingCity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shipping_state', length: 100, nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "shippingState", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shipping_postal', length: 20 }),
    __metadata("design:type", String)
], Order.prototype, "shippingPostal", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shipping_country', length: 100, default: 'Pakistan' }),
    __metadata("design:type", String)
], Order.prototype, "shippingCountry", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'billing_name', length: 200, nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "billingName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'billing_line1', length: 255, nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "billingLine1", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'billing_city', length: 100, nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "billingCity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'billing_state', length: 100, nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "billingState", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'billing_postal', length: 20, nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "billingPostal", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'billing_country', length: 100, nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "billingCountry", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'billing_same_as_shipping', default: true }),
    __metadata("design:type", Boolean)
], Order.prototype, "billingSameAsShipping", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "subtotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shipping_cost', type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "shippingCost", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tax_amount', type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "taxAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'discount_amount', type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "discountAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "total", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'coupon_id', type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "couponId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shipping_rate_id', nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "shippingRateId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => shipping_rate_entity_js_1.ShippingRate, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'shipping_rate_id' }),
    __metadata("design:type", shipping_rate_entity_js_1.ShippingRate)
], Order.prototype, "shippingRate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tracking_number', length: 100, nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "trackingNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'courier_name', length: 100, nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "courierName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'estimated_delivery', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Order.prototype, "estimatedDelivery", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'delivered_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], Order.prototype, "deliveredAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'admin_notes', type: 'text', nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "adminNotes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], Order.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz', name: 'updated_at' }),
    __metadata("design:type", Date)
], Order.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_item_entity_js_1.OrderItem, (item) => item.order),
    __metadata("design:type", Array)
], Order.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_status_history_entity_js_1.OrderStatusHistory, (history) => history.order),
    __metadata("design:type", Array)
], Order.prototype, "statusHistory", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => payment_entity_js_1.Payment, (payment) => payment.order),
    __metadata("design:type", Array)
], Order.prototype, "payments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => invoice_entity_js_1.Invoice, (invoice) => invoice.order),
    __metadata("design:type", Array)
], Order.prototype, "invoices", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => return_request_entity_js_1.ReturnRequest, (ret) => ret.order),
    __metadata("design:type", Array)
], Order.prototype, "returnRequests", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => refund_entity_js_1.Refund, (ref) => ref.order),
    __metadata("design:type", Array)
], Order.prototype, "refunds", void 0);
exports.Order = Order = __decorate([
    (0, typeorm_1.Entity)('orders')
], Order);
//# sourceMappingURL=order.entity.js.map