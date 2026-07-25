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
exports.TaxRule = void 0;
const typeorm_1 = require("typeorm");
let TaxRule = class TaxRule {
    id;
    name;
    country;
    state;
    rate;
    appliesTo;
    isActive;
    createdAt;
};
exports.TaxRule = TaxRule;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TaxRule.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], TaxRule.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 10, default: 'PK' }),
    __metadata("design:type", String)
], TaxRule.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], TaxRule.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 4 }),
    __metadata("design:type", Number)
], TaxRule.prototype, "rate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'applies_to', length: 30, default: 'all' }),
    __metadata("design:type", String)
], TaxRule.prototype, "appliesTo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], TaxRule.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], TaxRule.prototype, "createdAt", void 0);
exports.TaxRule = TaxRule = __decorate([
    (0, typeorm_1.Entity)('tax_rules')
], TaxRule);
//# sourceMappingURL=tax-rule.entity.js.map