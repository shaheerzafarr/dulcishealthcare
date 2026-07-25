import { JwtService } from '@nestjs/jwt';
import { AnalyticsService } from './analytics.service.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';
export declare class AnalyticsController {
    private readonly analyticsService;
    private readonly jwtService;
    constructor(analyticsService: AnalyticsService, jwtService: JwtService);
    startSession(req: any, ipAddress: string, sessionId: string, referrer?: string, landingPage?: string, deviceType?: string, country?: string, city?: string, utmTags?: any): Promise<import("./entities/visitor-session.entity.js").VisitorSession>;
    trackEvent(req: any, sessionId: string, eventName: string, platform: string, eventData?: any): Promise<import("./entities/pixel-event.entity.js").PixelEvent>;
    adminGetOverview(startDate?: string, endDate?: string): Promise<any>;
    adminGetSessions(paginationDto: PaginationDto): Promise<{
        sessions: import("./entities/visitor-session.entity.js").VisitorSession[];
        total: number;
        page: number;
        limit: number;
    }>;
}
