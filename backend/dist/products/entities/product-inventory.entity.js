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
exports.ProductInventory = void 0;
const typeorm_1 = require("typeorm");
const product_variant_entity_js_1 = require("./product-variant.entity.js");
let ProductInventory = class ProductInventory {
    id;
    variantId;
    variant;
    quantity;
    reserved;
    lowStockThreshold;
    trackInventory;
    updatedAt;
};
exports.ProductInventory = ProductInventory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ProductInventory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'variant_id', unique: true }),
    __metadata("design:type", String)
], ProductInventory.prototype, "variantId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => product_variant_entity_js_1.ProductVariant, (variant) => variant.inventory, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'variant_id' }),
    __metadata("design:type", product_variant_entity_js_1.ProductVariant)
], ProductInventory.prototype, "variant", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], ProductInventory.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], ProductInventory.prototype, "reserved", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'low_stock_threshold', default: 5 }),
    __metadata("design:type", Number)
], ProductInventory.prototype, "lowStockThreshold", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'track_inventory', default: true }),
    __metadata("design:type", Boolean)
], ProductInventory.prototype, "trackInventory", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz', name: 'updated_at' }),
    __metadata("design:type", Date)
], ProductInventory.prototype, "updatedAt", void 0);
exports.ProductInventory = ProductInventory = __decorate([
    (0, typeorm_1.Entity)('product_inventory')
], ProductInventory);
//# sourceMappingURL=product-inventory.entity.js.map