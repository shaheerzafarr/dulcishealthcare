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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_1 = require("@nestjs/jwt");
const marketing_service_js_1 = require("./marketing.service.js");
const jwt_auth_guard_js_1 = require("../common/guards/jwt-auth.guard.js");
const roles_guard_js_1 = require("../common/guards/roles.guard.js");
const roles_decorator_js_1 = require("../common/decorators/roles.decorator.js");
const public_decorator_js_1 = require("../common/decorators/public.decorator.js");
const pagination_dto_js_1 = require("../common/dto/pagination.dto.js");
let MarketingController = class MarketingController {
    marketingService;
    jwtService;
    constructor(marketingService, jwtService) {
        this.marketingService = marketingService;
        this.jwtService = jwtService;
    }
    async validate(req, code, subtotal, productIds, categoryIds) {
        let userId = null;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            try {
                const token = authHeader.substring(7);
                const decoded = this.jwtService.decode(token);
                if (decoded && decoded.sub) {
                    userId = decoded.sub;
                }
            }
            catch (err) {
            }
        }
        return this.marketingService.validateCoupon(code, userId || '', subtotal, productIds || [], categoryIds || []);
    }
    subscribe(email, firstName, source) {
        return this.marketingService.subscribeNewsletter(email, firstName, source);
    }
    unsubscribe(email) {
        return this.marketingService.unsubscribeNewsletter(email);
    }
    adminGetCoupons() {
        return this.marketingService.findAllCoupons();
    }
    adminCreateCoupon(dto) {
        return this.marketingService.createCoupon(dto);
    }
    adminUpdateCoupon(id, dto) {
        return this.marketingService.updateCoupon(id, dto);
    }
    adminDeleteCoupon(id) {
        return this.marketingService.deleteCoupon(id);
    }
    adminGetDiscounts() {
        return this.marketingService.findAllDiscounts();
    }
    adminCreateDiscount(dto) {
        return this.marketingService.createDiscount(dto);
    }
    adminUpdateDiscount(id, dto) {
        return this.marketingService.updateDiscount(id, dto);
    }
    adminDeleteDiscount(id) {
        return this.marketingService.deleteDiscount(id);
    }
    adminGetFlashSales() {
        return this.marketingService.findAllFlashSales();
    }
    adminCreateFlashSale(dto) {
        return this.marketingService.createFlashSale(dto);
    }
    adminUpdateFlashSale(id, dto) {
        return this.marketingService.updateFlashSale(id, dto);
    }
    adminDeleteFlashSale(id) {
        return this.marketingService.deleteFlashSale(id);
    }
    adminGetSubscribers(paginationDto) {
        return this.marketingService.findAllSubscribers(paginationDto);
    }
    adminGetAbandonedCarts(paginationDto, unrecovered) {
        const unrecoveredOnly = unrecovered === 'true';
        return this.marketingService.findAllAbandonedCarts(paginationDto, unrecoveredOnly);
    }
    adminSendReminders() {
        return this.marketingService.triggerRecoveryEmails();
    }
};
exports.MarketingController = MarketingController;
__decorate([
    (0, public_decorator_js_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Validate coupon applicability and calculate discount' }),
    (0, common_1.Post)('api/coupons/validate'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('code')),
    __param(2, (0, common_1.Body)('subtotal')),
    __param(3, (0, common_1.Body)('productIds')),
    __param(4, (0, common_1.Body)('categoryIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number, Array, Array]),
    __metadata("design:returntype", Promise)
], MarketingController.prototype, "validate", null);
__decorate([
    (0, public_decorator_js_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Subscribe email to newsletter list' }),
    (0, common_1.Post)('api/newsletter/subscribe'),
    __param(0, (0, common_1.Body)('email')),
    __param(1, (0, common_1.Body)('firstName')),
    __param(2, (0, common_1.Body)('source')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], MarketingController.prototype, "subscribe", null);
__decorate([
    (0, public_decorator_js_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Unsubscribe email from newsletter' }),
    (0, common_1.Post)('api/newsletter/unsubscribe'),
    __param(0, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MarketingController.prototype, "unsubscribe", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin', 'manager'),
    (0, swagger_1.ApiOperation)({ summary: 'List all promo coupons (Admin)' }),
    (0, common_1.Get)('api/admin/coupons'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MarketingController.prototype, "adminGetCoupons", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Create new promo coupon (Admin)' }),
    (0, common_1.Post)('api/admin/coupons'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MarketingController.prototype, "adminCreateCoupon", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Modify coupon rules (Admin)' }),
    (0, common_1.Patch)('api/admin/coupons/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MarketingController.prototype, "adminUpdateCoupon", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete promo coupon (Admin)' }),
    (0, common_1.Delete)('api/admin/coupons/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MarketingController.prototype, "adminDeleteCoupon", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin', 'manager'),
    (0, swagger_1.ApiOperation)({ summary: 'List automatic markdown discounts (Admin)' }),
    (0, common_1.Get)('api/admin/discounts'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MarketingController.prototype, "adminGetDiscounts", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Create automatic markdown discount rule (Admin)' }),
    (0, common_1.Post)('api/admin/discounts'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MarketingController.prototype, "adminCreateDiscount", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Modify automatic discount details (Admin)' }),
    (0, common_1.Patch)('api/admin/discounts/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MarketingController.prototype, "adminUpdateDiscount", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete discount rule (Admin)' }),
    (0, common_1.Delete)('api/admin/discounts/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MarketingController.prototype, "adminDeleteDiscount", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin', 'manager'),
    (0, swagger_1.ApiOperation)({ summary: 'List active and scheduled flash sales (Admin)' }),
    (0, common_1.Get)('api/admin/flash-sales'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MarketingController.prototype, "adminGetFlashSales", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Create time-sensitive flash sale event (Admin)' }),
    (0, common_1.Post)('api/admin/flash-sales'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MarketingController.prototype, "adminCreateFlashSale", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Modify flash sale parameters (Admin)' }),
    (0, common_1.Patch)('api/admin/flash-sales/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MarketingController.prototype, "adminUpdateFlashSale", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel/Delete flash sale event (Admin)' }),
    (0, common_1.Delete)('api/admin/flash-sales/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MarketingController.prototype, "adminDeleteFlashSale", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin', 'manager'),
    (0, swagger_1.ApiOperation)({ summary: 'List newsletter subscribers (Admin)' }),
    (0, common_1.Get)('api/admin/newsletter/subscribers'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_js_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], MarketingController.prototype, "adminGetSubscribers", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin', 'manager'),
    (0, swagger_1.ApiOperation)({ summary: 'List abandoned customer carts (Admin)' }),
    (0, common_1.Get)('api/admin/abandoned-carts'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)('unrecovered')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_js_1.PaginationDto, String]),
    __metadata("design:returntype", void 0)
], MarketingController.prototype, "adminGetAbandonedCarts", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Dispatch recovery emails to abandoned checkouts (Admin)' }),
    (0, common_1.Post)('api/admin/abandoned-carts/send-reminders'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MarketingController.prototype, "adminSendReminders", null);
exports.MarketingController = MarketingController = __decorate([
    (0, swagger_1.ApiTags)('Marketing & Promotions'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [marketing_service_js_1.MarketingService,
        jwt_1.JwtService])
], MarketingController);
//# sourceMappingURL=marketing.controller.js.map