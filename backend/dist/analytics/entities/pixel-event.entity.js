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
exports.PixelEvent = void 0;
const typeorm_1 = require("typeorm");
const visitor_session_entity_js_1 = require("./visitor-session.entity.js");
const user_entity_js_1 = require("../../users/entities/user.entity.js");
let PixelEvent = class PixelEvent {
    id;
    sessionId;
    session;
    userId;
    user;
    eventName;
    platform;
    eventData;
    sentToGateway;
    gatewayResponse;
    createdAt;
};
exports.PixelEvent = PixelEvent;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PixelEvent.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'session_id', nullable: true }),
    __metadata("design:type", String)
], PixelEvent.prototype, "sessionId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => visitor_session_entity_js_1.VisitorSession, (session) => session.pixelEvents, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'session_id' }),
    __metadata("design:type", visitor_session_entity_js_1.VisitorSession)
], PixelEvent.prototype, "session", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', nullable: true }),
    __metadata("design:type", String)
], PixelEvent.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_js_1.User, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_js_1.User)
], PixelEvent.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'event_name', length: 100 }),
    __metadata("design:type", String)
], PixelEvent.prototype, "eventName", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 30 }),
    __metadata("design:type", String)
], PixelEvent.prototype, "platform", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', name: 'event_data', nullable: true }),
    __metadata("design:type", Object)
], PixelEvent.prototype, "eventData", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sent_to_gateway', default: false }),
    __metadata("design:type", Boolean)
], PixelEvent.prototype, "sentToGateway", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', name: 'gateway_response', nullable: true }),
    __metadata("design:type", Object)
], PixelEvent.prototype, "gatewayResponse", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], PixelEvent.prototype, "createdAt", void 0);
exports.PixelEvent = PixelEvent = __decorate([
    (0, typeorm_1.Entity)('pixel_events')
], PixelEvent);
//# sourceMappingURL=pixel-event.entity.js.map