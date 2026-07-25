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
exports.ProductGallery = void 0;
const typeorm_1 = require("typeorm");
const product_entity_js_1 = require("./product.entity.js");
let ProductGallery = class ProductGallery {
    id;
    productId;
    product;
    imageData;
    mimeType;
    filename;
    caption;
    sortOrder;
    createdAt;
};
exports.ProductGallery = ProductGallery;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ProductGallery.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id' }),
    __metadata("design:type", String)
], ProductGallery.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_js_1.Product, (product) => product.gallery, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", product_entity_js_1.Product)
], ProductGallery.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bytea', name: 'image_data' }),
    __metadata("design:type", Buffer)
], ProductGallery.prototype, "imageData", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'mime_type', length: 50 }),
    __metadata("design:type", String)
], ProductGallery.prototype, "mimeType", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], ProductGallery.prototype, "filename", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], ProductGallery.prototype, "caption", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sort_order', default: 0 }),
    __metadata("design:type", Number)
], ProductGallery.prototype, "sortOrder", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], ProductGallery.prototype, "createdAt", void 0);
exports.ProductGallery = ProductGallery = __decorate([
    (0, typeorm_1.Entity)('product_gallery')
], ProductGallery);
//# sourceMappingURL=product-gallery.entity.js.map