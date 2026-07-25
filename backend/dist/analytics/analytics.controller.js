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
exports.AnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_1 = require("@nestjs/jwt");
const analytics_service_js_1 = require("./analytics.service.js");
const jwt_auth_guard_js_1 = require("../common/guards/jwt-auth.guard.js");
const roles_guard_js_1 = require("../common/guards/roles.guard.js");
const roles_decorator_js_1 = require("../common/decorators/roles.decorator.js");
const public_decorator_js_1 = require("../common/decorators/public.decorator.js");
const pagination_dto_js_1 = require("../common/dto/pagination.dto.js");
let AnalyticsController = class AnalyticsController {
    analyticsService;
    jwtService;
    constructor(analyticsService, jwtService) {
        this.analyticsService = analyticsService;
        this.jwtService = jwtService;
    }
    async startSession(req, ipAddress, sessionId, referrer, landingPage, deviceType, country, city, utmTags) {
        const userAgent = req.headers['user-agent'] || '';
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
        return this.analyticsService.startSession(userId, sessionId, ipAddress, userAgent, referrer || '', landingPage || '', deviceType || 'desktop', country, city, utmTags);
    }
    async trackEvent(req, sessionId, eventName, platform, eventData) {
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
        return this.analyticsService.trackEvent(userId, sessionId, eventName, platform, eventData);
    }
    adminGetOverview(startDate, endDate) {
        return this.analyticsService.getOverviewStats(startDate, endDate);
    }
    adminGetSessions(paginationDto) {
        return this.analyticsService.getSessions(paginationDto);
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, public_decorator_js_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Register shopper session landing' }),
    (0, common_1.Post)('api/analytics/session'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Ip)()),
    __param(2, (0, common_1.Body)('sessionId')),
    __param(3, (0, common_1.Body)('referrer')),
    __param(4, (0, common_1.Body)('landingPage')),
    __param(5, (0, common_1.Body)('deviceType')),
    __param(6, (0, common_1.Body)('country')),
    __param(7, (0, common_1.Body)('city')),
    __param(8, (0, common_1.Body)('utmTags')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "startSession", null);
__decorate([
    (0, public_decorator_js_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Log analytics events & dispatch Meta CAPI server-side' }),
    (0, common_1.Post)('api/analytics/event'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)('sessionId')),
    __param(2, (0, common_1.Body)('eventName')),
    __param(3, (0, common_1.Body)('platform')),
    __param(4, (0, common_1.Body)('eventData')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "trackEvent", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin', 'manager'),
    (0, swagger_1.ApiOperation)({ summary: 'Get general sales & tracking metrics dashboard (Admin)' }),
    (0, common_1.Get)('api/admin/analytics/overview'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "adminGetOverview", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin', 'manager'),
    (0, swagger_1.ApiOperation)({ summary: 'List customer sessions (Admin)' }),
    (0, common_1.Get)('api/admin/analytics/sessions'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_js_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "adminGetSessions", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, swagger_1.ApiTags)('Analytics & Tracking'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [analytics_service_js_1.AnalyticsService,
        jwt_1.JwtService])
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map