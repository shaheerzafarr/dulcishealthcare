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
exports.QuizRecommendation = void 0;
const typeorm_1 = require("typeorm");
const quiz_result_entity_js_1 = require("./quiz-result.entity.js");
const product_entity_js_1 = require("../../products/entities/product.entity.js");
let QuizRecommendation = class QuizRecommendation {
    id;
    resultId;
    result;
    productId;
    product;
    sortOrder;
    reason;
};
exports.QuizRecommendation = QuizRecommendation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], QuizRecommendation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'result_id' }),
    __metadata("design:type", String)
], QuizRecommendation.prototype, "resultId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => quiz_result_entity_js_1.QuizResult, (result) => result.recommendations, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'result_id' }),
    __metadata("design:type", quiz_result_entity_js_1.QuizResult)
], QuizRecommendation.prototype, "result", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id' }),
    __metadata("design:type", String)
], QuizRecommendation.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_js_1.Product, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", product_entity_js_1.Product)
], QuizRecommendation.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sort_order', default: 0 }),
    __metadata("design:type", Number)
], QuizRecommendation.prototype, "sortOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], QuizRecommendation.prototype, "reason", void 0);
exports.QuizRecommendation = QuizRecommendation = __decorate([
    (0, typeorm_1.Entity)('quiz_recommendations')
], QuizRecommendation);
//# sourceMappingURL=quiz-recommendation.entity.js.map