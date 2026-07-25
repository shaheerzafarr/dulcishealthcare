import { Repository } from 'typeorm';
import { VisitorSession } from './entities/visitor-session.entity.js';
import { UtmTracking } from './entities/utm-tracking.entity.js';
import { PixelEvent } from './entities/pixel-event.entity.js';
import { CmsService } from '../cms/cms.service.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';
export declare class AnalyticsService {
    private sessionRepo;
    private utmRepo;
    private eventRepo;
    private cmsService;
    constructor(sessionRepo: Repository<VisitorSession>, utmRepo: Repository<UtmTracking>, eventRepo: Repository<PixelEvent>, cmsService: CmsService);
    startSession(userId: string | null, sessionId: string, ip: string, userAgent: string, referrer: string, landingPage: string, deviceType: string, country?: string, city?: string, utmTags?: any): Promise<VisitorSession>;
    trackEvent(userId: string | null, sessionId: string, eventName: string, platform: string, eventData?: any): Promise<PixelEvent>;
    getOverviewStats(startDate?: string, endDate?: string): Promise<any>;
    getSessions(paginationDto: PaginationDto): Promise<{
        sessions: VisitorSession[];
        total: number;
        page: number;
        limit: number;
    }>;
}
