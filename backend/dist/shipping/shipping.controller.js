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
exports.ShippingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const shipping_service_js_1 = require("./shipping.service.js");
const jwt_auth_guard_js_1 = require("../common/guards/jwt-auth.guard.js");
const roles_guard_js_1 = require("../common/guards/roles.guard.js");
const roles_decorator_js_1 = require("../common/decorators/roles.decorator.js");
const public_decorator_js_1 = require("../common/decorators/public.decorator.js");
let ShippingController = class ShippingController {
    shippingService;
    constructor(shippingService) {
        this.shippingService = shippingService;
    }
    getRates() {
        return this.shippingService.findAllRates();
    }
    adminGetZones() {
        return this.shippingService.findAllZones();
    }
    adminCreateZone(dto) {
        return this.shippingService.createZone(dto);
    }
    adminUpdateZone(id, dto) {
        return this.shippingService.updateZone(id, dto);
    }
    adminDeleteZone(id) {
        return this.shippingService.deleteZone(id);
    }
    adminGetRates() {
        return this.shippingService.findAllRates();
    }
    adminCreateRate(dto) {
        return this.shippingService.createRate(dto);
    }
    adminUpdateRate(id, dto) {
        return this.shippingService.updateRate(id, dto);
    }
    adminDeleteRate(id) {
        return this.shippingService.deleteRate(id);
    }
    adminGetTaxes() {
        return this.shippingService.findAllTaxes();
    }
    adminCreateTax(dto) {
        return this.shippingService.createTax(dto);
    }
    adminUpdateTax(id, dto) {
        return this.shippingService.updateTax(id, dto);
    }
    adminDeleteTax(id) {
        return this.shippingService.deleteTax(id);
    }
};
exports.ShippingController = ShippingController;
__decorate([
    (0, public_decorator_js_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all active shipping rates' }),
    (0, common_1.Get)('api/shipping/rates'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ShippingController.prototype, "getRates", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'List all shipping zones (Admin)' }),
    (0, common_1.Get)('api/admin/shipping/zones'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ShippingController.prototype, "adminGetZones", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Create shipping zone (Admin)' }),
    (0, common_1.Post)('api/admin/shipping/zones'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ShippingController.prototype, "adminCreateZone", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Update shipping zone details (Admin)' }),
    (0, common_1.Patch)('api/admin/shipping/zones/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ShippingController.prototype, "adminUpdateZone", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove shipping zone (Admin)' }),
    (0, common_1.Delete)('api/admin/shipping/zones/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ShippingController.prototype, "adminDeleteZone", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'List all shipping rates (Admin)' }),
    (0, common_1.Get)('api/admin/shipping/rates'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ShippingController.prototype, "adminGetRates", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Create shipping rate in zone (Admin)' }),
    (0, common_1.Post)('api/admin/shipping/rates'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ShippingController.prototype, "adminCreateRate", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Update shipping rate details (Admin)' }),
    (0, common_1.Patch)('api/admin/shipping/rates/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ShippingController.prototype, "adminUpdateRate", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove shipping rate (Admin)' }),
    (0, common_1.Delete)('api/admin/shipping/rates/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ShippingController.prototype, "adminDeleteRate", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'List all tax rules (Admin)' }),
    (0, common_1.Get)('api/admin/taxes'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ShippingController.prototype, "adminGetTaxes", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Create tax rule (Admin)' }),
    (0, common_1.Post)('api/admin/taxes'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ShippingController.prototype, "adminCreateTax", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Update tax rule details (Admin)' }),
    (0, common_1.Patch)('api/admin/taxes/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ShippingController.prototype, "adminUpdateTax", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove tax rule (Admin)' }),
    (0, common_1.Delete)('api/admin/taxes/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ShippingController.prototype, "adminDeleteTax", null);
exports.ShippingController = ShippingController = __decorate([
    (0, swagger_1.ApiTags)('Shipping & Taxes'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [shipping_service_js_1.ShippingService])
], ShippingController);
//# sourceMappingURL=shipping.controller.js.map