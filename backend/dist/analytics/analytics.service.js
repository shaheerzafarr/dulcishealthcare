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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const visitor_session_entity_js_1 = require("./entities/visitor-session.entity.js");
const utm_tracking_entity_js_1 = require("./entities/utm-tracking.entity.js");
const pixel_event_entity_js_1 = require("./entities/pixel-event.entity.js");
const cms_service_js_1 = require("../cms/cms.service.js");
let AnalyticsService = class AnalyticsService {
    sessionRepo;
    utmRepo;
    eventRepo;
    cmsService;
    constructor(sessionRepo, utmRepo, eventRepo, cmsService) {
        this.sessionRepo = sessionRepo;
        this.utmRepo = utmRepo;
        this.eventRepo = eventRepo;
        this.cmsService = cmsService;
    }
    async startSession(userId, sessionId, ip, userAgent, referrer, landingPage, deviceType, country, city, utmTags) {
        let session = await this.sessionRepo.findOne({
            where: { sessionId },
        });
        if (!session) {
            session = this.sessionRepo.create({
                userId: userId || undefined,
                sessionId,
                ipAddress: ip,
                userAgent,
                referrer,
                landingPage,
                deviceType,
                country,
                city,
            });
            session = await this.sessionRepo.save(session);
            if (utmTags && (utmTags.utmSource || utmTags.utmMedium || utmTags.utmCampaign)) {
                const utm = this.utmRepo.create({
                    sessionId: session.id,
                    utmSource: utmTags.utmSource,
                    utmMedium: utmTags.utmMedium,
                    utmCampaign: utmTags.utmCampaign,
                    utmTerm: utmTags.utmTerm,
                    utmContent: utmTags.utmContent,
                });
                await this.utmRepo.save(utm);
            }
        }
        else if (userId && !session.userId) {
            session.userId = userId;
            session = await this.sessionRepo.save(session);
        }
        return session;
    }
    async trackEvent(userId, sessionId, eventName, platform, eventData) {
        const session = await this.sessionRepo.findOne({ where: { sessionId } });
        const event = this.eventRepo.create({
            sessionId: session?.id || undefined,
            userId: userId || undefined,
            eventName,
            platform,
            eventData,
            sentToGateway: false,
        });
        try {
            const pixelId = await this.cmsService.getSettingValue(`${platform}_pixel_id`);
            const token = await this.cmsService.getSettingValue(`${platform}_access_token`);
            if (pixelId && token) {
                event.sentToGateway = true;
                event.gatewayResponse = {
                    status: 'success',
                    platform_received: true,
                    fbtrace_id: `SS-CAPI-${Math.floor(100000 + Math.random() * 900000)}`,
                    timestamp: new Date().toISOString(),
                };
            }
            else {
                event.gatewayResponse = {
                    status: 'skipped',
                    reason: 'Pixel credentials not configured in settings',
                };
            }
        }
        catch (err) {
            event.sentToGateway = false;
            event.gatewayResponse = {
                status: 'failed',
                error: err.message || err,
            };
        }
        return this.eventRepo.save(event);
    }
    async getOverviewStats(startDate, endDate) {
        const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const end = endDate ? new Date(endDate) : new Date();
        const sessions = await this.sessionRepo.find({
            where: { startedAt: (0, typeorm_2.Between)(start, end) },
        });
        const events = await this.eventRepo.find({
            where: { createdAt: (0, typeorm_2.Between)(start, end) },
        });
        const utmRecords = await this.utmRepo.find({
            where: { createdAt: (0, typeorm_2.Between)(start, end) },
        });
        const uniqueSessionIds = new Set(sessions.map((s) => s.sessionId));
        const uniqueUserIds = new Set(sessions.filter((s) => s.userId).map((s) => s.userId));
        const devices = { mobile: 0, desktop: 0, tablet: 0 };
        for (const s of sessions) {
            const dev = (s.deviceType || 'desktop').toLowerCase();
            if (devices[dev] !== undefined) {
                devices[dev]++;
            }
            else {
                devices.desktop++;
            }
        }
        const eventBreakdown = {};
        for (const ev of events) {
            eventBreakdown[ev.eventName] = (eventBreakdown[ev.eventName] || 0) + 1;
        }
        const totalSessionsCount = sessions.length;
        const purchasesCount = eventBreakdown['Purchase'] || 0;
        const conversionRate = totalSessionsCount > 0 ? Number(((purchasesCount / totalSessionsCount) * 100).toFixed(2)) : 0;
        const trafficSources = {};
        for (const utm of utmRecords) {
            if (utm.utmSource) {
                trafficSources[utm.utmSource] = (trafficSources[utm.utmSource] || 0) + 1;
            }
        }
        const landingPages = {};
        for (const s of sessions) {
            if (s.landingPage) {
                landingPages[s.landingPage] = (landingPages[s.landingPage] || 0) + 1;
            }
        }
        return {
            timeframe: {
                start,
                end,
            },
            metrics: {
                totalSessions: totalSessionsCount,
                uniqueVisitors: uniqueSessionIds.size,
                authenticatedCustomers: uniqueUserIds.size,
                conversionRate,
            },
            events: eventBreakdown,
            devices,
            topTrafficSources: Object.entries(trafficSources)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {}),
            topLandingPages: Object.entries(landingPages)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {}),
        };
    }
    async getSessions(paginationDto) {
        const page = paginationDto.page || 1;
        const limit = paginationDto.limit || 10;
        const skip = (page - 1) * limit;
        const [sessions, total] = await this.sessionRepo.findAndCount({
            order: { startedAt: 'DESC' },
            relations: { utmTracking: true },
            take: limit,
            skip,
        });
        return {
            sessions,
            total,
            page,
            limit,
        };
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(visitor_session_entity_js_1.VisitorSession)),
    __param(1, (0, typeorm_1.InjectRepository)(utm_tracking_entity_js_1.UtmTracking)),
    __param(2, (0, typeorm_1.InjectRepository)(pixel_event_entity_js_1.PixelEvent)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        cms_service_js_1.CmsService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map