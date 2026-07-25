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
exports.VisitorSession = void 0;
const typeorm_1 = require("typeorm");
const user_entity_js_1 = require("../../users/entities/user.entity.js");
const utm_tracking_entity_js_1 = require("./utm-tracking.entity.js");
const pixel_event_entity_js_1 = require("./pixel-event.entity.js");
let VisitorSession = class VisitorSession {
    id;
    userId;
    user;
    sessionId;
    ipAddress;
    userAgent;
    referrer;
    landingPage;
    deviceType;
    country;
    city;
    startedAt;
    endedAt;
    utmTracking;
    pixelEvents;
};
exports.VisitorSession = VisitorSession;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], VisitorSession.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', nullable: true }),
    __metadata("design:type", String)
], VisitorSession.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_js_1.User, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_js_1.User)
], VisitorSession.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'session_id', length: 255 }),
    __metadata("design:type", String)
], VisitorSession.prototype, "sessionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ip_address', length: 45, nullable: true }),
    __metadata("design:type", String)
], VisitorSession.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_agent', type: 'text', nullable: true }),
    __metadata("design:type", String)
], VisitorSession.prototype, "userAgent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], VisitorSession.prototype, "referrer", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'landing_page', length: 500, nullable: true }),
    __metadata("design:type", String)
], VisitorSession.prototype, "landingPage", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'device_type', length: 20, nullable: true }),
    __metadata("design:type", String)
], VisitorSession.prototype, "deviceType", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], VisitorSession.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], VisitorSession.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz', name: 'started_at' }),
    __metadata("design:type", Date)
], VisitorSession.prototype, "startedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ended_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Date)
], VisitorSession.prototype, "endedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => utm_tracking_entity_js_1.UtmTracking, (utm) => utm.session),
    __metadata("design:type", Array)
], VisitorSession.prototype, "utmTracking", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => pixel_event_entity_js_1.PixelEvent, (event) => event.session),
    __metadata("design:type", Array)
], VisitorSession.prototype, "pixelEvents", void 0);
exports.VisitorSession = VisitorSession = __decorate([
    (0, typeorm_1.Entity)('visitor_sessions')
], VisitorSession);
//# sourceMappingURL=visitor-session.entity.js.map