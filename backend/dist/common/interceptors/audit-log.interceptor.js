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
exports.AuditLogInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const audit_service_js_1 = require("../../audit/audit.service.js");
let AuditLogInterceptor = class AuditLogInterceptor {
    auditService;
    constructor(auditService) {
        this.auditService = auditService;
    }
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const { method, url, user, body, ip, headers } = request;
        const isWriteOperation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
        const isAdminRoute = url.startsWith('/api/admin');
        if (!isWriteOperation || !isAdminRoute) {
            return next.handle();
        }
        return next.handle().pipe((0, operators_1.tap)({
            next: async (responseBody) => {
                try {
                    let entityType = null;
                    let entityId = null;
                    const urlParts = url.split('/');
                    const productIndex = urlParts.indexOf('products');
                    const userIndex = urlParts.indexOf('users');
                    const couponIndex = urlParts.indexOf('coupons');
                    if (productIndex !== -1 && urlParts[productIndex + 1]) {
                        entityType = 'product';
                        entityId = urlParts[productIndex + 1];
                    }
                    else if (userIndex !== -1 && urlParts[userIndex + 1]) {
                        entityType = 'user';
                        entityId = urlParts[userIndex + 1];
                    }
                    else if (couponIndex !== -1 && urlParts[couponIndex + 1]) {
                        entityType = 'coupon';
                        entityId = urlParts[couponIndex + 1];
                    }
                    await this.auditService.log({
                        userId: user?.id || undefined,
                        action: `${method} ${url}`,
                        entityType: entityType || undefined,
                        entityId: entityId || undefined,
                        newValues: body,
                        ipAddress: ip,
                        userAgent: headers['user-agent'],
                    });
                }
                catch (err) {
                    console.error('AuditLogInterceptor logging error:', err);
                }
            },
        }));
    }
};
exports.AuditLogInterceptor = AuditLogInterceptor;
exports.AuditLogInterceptor = AuditLogInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [audit_service_js_1.AuditService])
], AuditLogInterceptor);
//# sourceMappingURL=audit-log.interceptor.js.map