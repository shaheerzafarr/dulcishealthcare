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
exports.ReturnRequest = void 0;
const typeorm_1 = require("typeorm");
const order_entity_js_1 = require("./order.entity.js");
const user_entity_js_1 = require("../../users/entities/user.entity.js");
let ReturnRequest = class ReturnRequest {
    id;
    orderId;
    order;
    userId;
    user;
    status;
    reason;
    description;
    imageData;
    imageMime;
    adminNotes;
    resolvedAt;
    createdAt;
    updatedAt;
};
exports.ReturnRequest = ReturnRequest;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ReturnRequest.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'order_id' }),
    __metadata("design:type", String)
], ReturnRequest.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => order_entity_js_1.Order, (order) => order.returnRequests, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'order_id' }),
    __metadata("design:type", order_entity_js_1.Order)
], ReturnRequest.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], ReturnRequest.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_js_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_js_1.User)
], ReturnRequest.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 30, default: 'requested' }),
    __metadata("design:type", String)
], ReturnRequest.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], ReturnRequest.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ReturnRequest.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bytea', name: 'image_data', nullable: true }),
    __metadata("design:type", Buffer)
], ReturnRequest.prototype, "imageData", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'image_mime', length: 50, nullable: true }),
    __metadata("design:type", String)
], ReturnRequest.prototype, "imageMime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'admin_notes', type: 'text', nullable: true }),
    __metadata("design:type", String)
], ReturnRequest.prototype, "adminNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'resolved_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], ReturnRequest.prototype, "resolvedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], ReturnRequest.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz', name: 'updated_at' }),
    __metadata("design:type", Date)
], ReturnRequest.prototype, "updatedAt", void 0);
exports.ReturnRequest = ReturnRequest = __decorate([
    (0, typeorm_1.Entity)('return_requests')
], ReturnRequest);
//# sourceMappingURL=return-request.entity.js.map