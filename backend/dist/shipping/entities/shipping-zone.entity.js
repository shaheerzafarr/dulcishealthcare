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
exports.ShippingZone = void 0;
const typeorm_1 = require("typeorm");
const shipping_rate_entity_js_1 = require("./shipping-rate.entity.js");
let ShippingZone = class ShippingZone {
    id;
    name;
    countries;
    states;
    isActive;
    createdAt;
    rates;
};
exports.ShippingZone = ShippingZone;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ShippingZone.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], ShippingZone.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', array: true, default: '{}' }),
    __metadata("design:type", Array)
], ShippingZone.prototype, "countries", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', array: true, nullable: true }),
    __metadata("design:type", Array)
], ShippingZone.prototype, "states", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], ShippingZone.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], ShippingZone.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => shipping_rate_entity_js_1.ShippingRate, (rate) => rate.zone),
    __metadata("design:type", Array)
], ShippingZone.prototype, "rates", void 0);
exports.ShippingZone = ShippingZone = __decorate([
    (0, typeorm_1.Entity)('shipping_zones')
], ShippingZone);
//# sourceMappingURL=shipping-zone.entity.js.map