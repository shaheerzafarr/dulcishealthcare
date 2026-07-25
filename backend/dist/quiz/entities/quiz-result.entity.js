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
exports.QuizResult = void 0;
const typeorm_1 = require("typeorm");
const quiz_entity_js_1 = require("./quiz.entity.js");
const quiz_recommendation_entity_js_1 = require("./quiz-recommendation.entity.js");
let QuizResult = class QuizResult {
    id;
    quizId;
    quiz;
    resultKey;
    title;
    description;
    createdAt;
    recommendations;
};
exports.QuizResult = QuizResult;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], QuizResult.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quiz_id' }),
    __metadata("design:type", String)
], QuizResult.prototype, "quizId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => quiz_entity_js_1.Quiz, (quiz) => quiz.results, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'quiz_id' }),
    __metadata("design:type", quiz_entity_js_1.Quiz)
], QuizResult.prototype, "quiz", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'result_key', length: 50 }),
    __metadata("design:type", String)
], QuizResult.prototype, "resultKey", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200, nullable: true }),
    __metadata("design:type", String)
], QuizResult.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], QuizResult.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], QuizResult.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => quiz_recommendation_entity_js_1.QuizRecommendation, (rec) => rec.result),
    __metadata("design:type", Array)
], QuizResult.prototype, "recommendations", void 0);
exports.QuizResult = QuizResult = __decorate([
    (0, typeorm_1.Entity)('quiz_results')
], QuizResult);
//# sourceMappingURL=quiz-result.entity.js.map