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
exports.NotificationPreference = void 0;
const typeorm_1 = require("typeorm");
const user_entity_js_1 = require("./user.entity.js");
let NotificationPreference = class NotificationPreference {
    id;
    userId;
    user;
    emailOrders;
    emailPromos;
    smsOrders;
    smsPromos;
    pushEnabled;
    updatedAt;
};
exports.NotificationPreference = NotificationPreference;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], NotificationPreference.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', unique: true }),
    __metadata("design:type", String)
], NotificationPreference.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_js_1.User, (user) => user.notificationPreference, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_js_1.User)
], NotificationPreference.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email_orders', default: true }),
    __metadata("design:type", Boolean)
], NotificationPreference.prototype, "emailOrders", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email_promos', default: true }),
    __metadata("design:type", Boolean)
], NotificationPreference.prototype, "emailPromos", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sms_orders', default: false }),
    __metadata("design:type", Boolean)
], NotificationPreference.prototype, "smsOrders", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sms_promos', default: false }),
    __metadata("design:type", Boolean)
], NotificationPreference.prototype, "smsPromos", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'push_enabled', default: false }),
    __metadata("design:type", Boolean)
], NotificationPreference.prototype, "pushEnabled", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz', name: 'updated_at' }),
    __metadata("design:type", Date)
], NotificationPreference.prototype, "updatedAt", void 0);
exports.NotificationPreference = NotificationPreference = __decorate([
    (0, typeorm_1.Entity)('notification_preferences')
], NotificationPreference);
//# sourceMappingURL=notification-preference.entity.js.map