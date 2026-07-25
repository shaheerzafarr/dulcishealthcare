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
exports.CategoryCard = void 0;
const typeorm_1 = require("typeorm");
const category_entity_js_1 = require("../../products/entities/category.entity.js");
let CategoryCard = class CategoryCard {
    id;
    categoryId;
    category;
    displayName;
    itemCountLabel;
    bgColor;
    sortOrder;
    isActive;
};
exports.CategoryCard = CategoryCard;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CategoryCard.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'category_id' }),
    __metadata("design:type", String)
], CategoryCard.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => category_entity_js_1.Category, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'category_id' }),
    __metadata("design:type", category_entity_js_1.Category)
], CategoryCard.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'display_name', length: 100 }),
    __metadata("design:type", String)
], CategoryCard.prototype, "displayName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'item_count_label', length: 50, nullable: true }),
    __metadata("design:type", String)
], CategoryCard.prototype, "itemCountLabel", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bg_color', length: 20, nullable: true }),
    __metadata("design:type", String)
], CategoryCard.prototype, "bgColor", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sort_order', default: 0 }),
    __metadata("design:type", Number)
], CategoryCard.prototype, "sortOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], CategoryCard.prototype, "isActive", void 0);
exports.CategoryCard = CategoryCard = __decorate([
    (0, typeorm_1.Entity)('category_cards')
], CategoryCard);
//# sourceMappingURL=category-card.entity.js.map