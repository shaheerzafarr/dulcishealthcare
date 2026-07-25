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
exports.Discount = void 0;
const typeorm_1 = require("typeorm");
let Discount = class Discount {
    id;
    name;
    discountType;
    discountValue;
    applyTo;
    applyToIds;
    startsAt;
    endsAt;
    isActive;
    createdAt;
};
exports.Discount = Discount;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Discount.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Discount.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'discount_type', length: 20 }),
    __metadata("design:type", String)
], Discount.prototype, "discountType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'discount_value', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Discount.prototype, "discountValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'apply_to', length: 30, default: 'all' }),
    __metadata("design:type", String)
], Discount.prototype, "applyTo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'apply_to_ids', type: 'uuid', array: true, default: '{}' }),
    __metadata("design:type", Array)
], Discount.prototype, "applyToIds", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'starts_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], Discount.prototype, "startsAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ends_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], Discount.prototype, "endsAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], Discount.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], Discount.prototype, "createdAt", void 0);
exports.Discount = Discount = __decorate([
    (0, typeorm_1.Entity)('discounts')
], Discount);
//# sourceMappingURL=discount.entity.js.map