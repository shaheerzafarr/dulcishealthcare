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
exports.ShippingRate = void 0;
const typeorm_1 = require("typeorm");
const shipping_zone_entity_js_1 = require("./shipping-zone.entity.js");
let ShippingRate = class ShippingRate {
    id;
    zoneId;
    zone;
    name;
    minOrderAmount;
    rate;
    ratePerKg;
    estimatedDaysMin;
    estimatedDaysMax;
    isActive;
    createdAt;
};
exports.ShippingRate = ShippingRate;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ShippingRate.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'zone_id' }),
    __metadata("design:type", String)
], ShippingRate.prototype, "zoneId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => shipping_zone_entity_js_1.ShippingZone, (zone) => zone.rates, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'zone_id' }),
    __metadata("design:type", shipping_zone_entity_js_1.ShippingZone)
], ShippingRate.prototype, "zone", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], ShippingRate.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'min_order_amount', type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], ShippingRate.prototype, "minOrderAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], ShippingRate.prototype, "rate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rate_per_kg', type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], ShippingRate.prototype, "ratePerKg", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'estimated_days_min', default: 1 }),
    __metadata("design:type", Number)
], ShippingRate.prototype, "estimatedDaysMin", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'estimated_days_max', default: 5 }),
    __metadata("design:type", Number)
], ShippingRate.prototype, "estimatedDaysMax", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], ShippingRate.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], ShippingRate.prototype, "createdAt", void 0);
exports.ShippingRate = ShippingRate = __decorate([
    (0, typeorm_1.Entity)('shipping_rates')
], ShippingRate);
//# sourceMappingURL=shipping-rate.entity.js.map