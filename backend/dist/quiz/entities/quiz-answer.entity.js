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
exports.QuizAnswer = void 0;
const typeorm_1 = require("typeorm");
const quiz_entity_js_1 = require("./quiz.entity.js");
const user_entity_js_1 = require("../../users/entities/user.entity.js");
let QuizAnswer = class QuizAnswer {
    id;
    quizId;
    quiz;
    userId;
    user;
    sessionId;
    answers;
    createdAt;
};
exports.QuizAnswer = QuizAnswer;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], QuizAnswer.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'quiz_id' }),
    __metadata("design:type", String)
], QuizAnswer.prototype, "quizId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => quiz_entity_js_1.Quiz, (quiz) => quiz.answers, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'quiz_id' }),
    __metadata("design:type", quiz_entity_js_1.Quiz)
], QuizAnswer.prototype, "quiz", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', nullable: true }),
    __metadata("design:type", String)
], QuizAnswer.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_js_1.User, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_js_1.User)
], QuizAnswer.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'session_id', length: 255, nullable: true }),
    __metadata("design:type", String)
], QuizAnswer.prototype, "sessionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Object)
], QuizAnswer.prototype, "answers", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], QuizAnswer.prototype, "createdAt", void 0);
exports.QuizAnswer = QuizAnswer = __decorate([
    (0, typeorm_1.Entity)('quiz_answers')
], QuizAnswer);
//# sourceMappingURL=quiz-answer.entity.js.map