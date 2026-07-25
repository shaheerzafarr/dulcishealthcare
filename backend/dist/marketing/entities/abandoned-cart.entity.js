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
exports.AbandonedCart = void 0;
const typeorm_1 = require("typeorm");
const user_entity_js_1 = require("../../users/entities/user.entity.js");
const order_entity_js_1 = require("../../orders/entities/order.entity.js");
let AbandonedCart = class AbandonedCart {
    id;
    userId;
    user;
    email;
    cartData;
    cartTotal;
    recoveryEmailSent;
    recoveryEmailSentAt;
    recovered;
    recoveredOrderId;
    recoveredOrder;
    abandonedAt;
    createdAt;
};
exports.AbandonedCart = AbandonedCart;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AbandonedCart.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', nullable: true }),
    __metadata("design:type", String)
], AbandonedCart.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_js_1.User, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_js_1.User)
], AbandonedCart.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], AbandonedCart.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', name: 'cart_data' }),
    __metadata("design:type", Object)
], AbandonedCart.prototype, "cartData", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cart_total', type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], AbandonedCart.prototype, "cartTotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'recovery_email_sent', default: false }),
    __metadata("design:type", Boolean)
], AbandonedCart.prototype, "recoveryEmailSent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'recovery_email_sent_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], AbandonedCart.prototype, "recoveryEmailSentAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], AbandonedCart.prototype, "recovered", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'recovered_order_id', nullable: true }),
    __metadata("design:type", String)
], AbandonedCart.prototype, "recoveredOrderId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => order_entity_js_1.Order, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'recovered_order_id' }),
    __metadata("design:type", order_entity_js_1.Order)
], AbandonedCart.prototype, "recoveredOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'abandoned_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], AbandonedCart.prototype, "abandonedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], AbandonedCart.prototype, "createdAt", void 0);
exports.AbandonedCart = AbandonedCart = __decorate([
    (0, typeorm_1.Entity)('abandoned_carts')
], AbandonedCart);
//# sourceMappingURL=abandoned-cart.entity.js.map