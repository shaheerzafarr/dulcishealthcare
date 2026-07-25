import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial, Between } from 'typeorm';
import { VisitorSession } from './entities/visitor-session.entity.js';
import { UtmTracking } from './entities/utm-tracking.entity.js';
import { PixelEvent } from './entities/pixel-event.entity.js';
import { CmsService } from '../cms/cms.service.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(VisitorSession) private sessionRepo: Repository<VisitorSession>,
    @InjectRepository(UtmTracking) private utmRepo: Repository<UtmTracking>,
    @InjectRepository(PixelEvent) private eventRepo: Repository<PixelEvent>,
    private cmsService: CmsService,
  ) {}

  // ==========================================
  // SESSION TRACKING
  // ==========================================

  async startSession(
    userId: string | null,
    sessionId: string,
    ip: string,
    userAgent: string,
    referrer: string,
    landingPage: string,
    deviceType: string,
    country?: string,
    city?: string,
    utmTags?: any,
  ): Promise<VisitorSession> {
    // Check if session already exists
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

      // Save UTM Tags if present
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
    } else if (userId && !session.userId) {
      // Link anonymous guest session to registered user on login
      session.userId = userId;
      session = await this.sessionRepo.save(session);
    }

    return session;
  }

  // ==========================================
  // PIXEL & CONVERSION API (CAPI) DISPATCH
  // ==========================================

  async trackEvent(
    userId: string | null,
    sessionId: string,
    eventName: string,
    platform: string, // 'meta', 'ga4', 'tiktok'
    eventData?: any,
  ): Promise<PixelEvent> {
    // Find active visitor session record
    const session = await this.sessionRepo.findOne({ where: { sessionId } });

    const event = this.eventRepo.create({
      sessionId: session?.id || undefined,
      userId: userId || undefined,
      eventName,
      platform,
      eventData,
      sentToGateway: false,
    });

    // Simulate dispatching Server-Side Conversions API (CAPI) / Measurement Protocol
    try {
      const pixelId = await this.cmsService.getSettingValue(`${platform}_pixel_id`);
      const token = await this.cmsService.getSettingValue(`${platform}_access_token`);

      if (pixelId && token) {
        // Here we would perform a real Axios POST request to Facebook CAPI:
        // https://graph.facebook.com/v16.0/{pixelId}/events?access_token={token}
        
        event.sentToGateway = true;
        event.gatewayResponse = {
          status: 'success',
          platform_received: true,
          fbtrace_id: `SS-CAPI-${Math.floor(100000 + Math.random() * 900000)}`,
          timestamp: new Date().toISOString(),
        };
      } else {
        event.gatewayResponse = {
          status: 'skipped',
          reason: 'Pixel credentials not configured in settings',
        };
      }
    } catch (err: any) {
      event.sentToGateway = false;
      event.gatewayResponse = {
        status: 'failed',
        error: err.message || err,
      };
    }

    return this.eventRepo.save(event);
  }

  // ==========================================
  // DASHBOARD OVERVIEW ANALYTICS
  // ==========================================

  async getOverviewStats(startDate?: string, endDate?: string): Promise<any> {
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    // Query session records within timeframe
    const sessions = await this.sessionRepo.find({
      where: { startedAt: Between(start, end) },
    });

    const events = await this.eventRepo.find({
      where: { createdAt: Between(start, end) },
    });

    const utmRecords = await this.utmRepo.find({
      where: { createdAt: Between(start, end) },
    });

    // Analytics calculations
    const uniqueSessionIds = new Set(sessions.map((s) => s.sessionId));
    const uniqueUserIds = new Set(sessions.filter((s) => s.userId).map((s) => s.userId));

    // Devices count
    const devices: Record<string, number> = { mobile: 0, desktop: 0, tablet: 0 };
    for (const s of sessions) {
      const dev = (s.deviceType || 'desktop').toLowerCase();
      if (devices[dev] !== undefined) {
        devices[dev]++;
      } else {
        devices.desktop++;
      }
    }

    // Events breakdown
    const eventBreakdown: Record<string, number> = {};
    for (const ev of events) {
      eventBreakdown[ev.eventName] = (eventBreakdown[ev.eventName] || 0) + 1;
    }

    // Conversion rate calculation
    const totalSessionsCount = sessions.length;
    const purchasesCount = eventBreakdown['Purchase'] || 0;
    const conversionRate = totalSessionsCount > 0 ? Number(((purchasesCount / totalSessionsCount) * 100).toFixed(2)) : 0;

    // Traffic sources breakdown
    const trafficSources: Record<string, number> = {};
    for (const utm of utmRecords) {
      if (utm.utmSource) {
        trafficSources[utm.utmSource] = (trafficSources[utm.utmSource] || 0) + 1;
      }
    }

    // Landing pages breakdown
    const landingPages: Record<string, number> = {};
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

  async getSessions(paginationDto: PaginationDto) {
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
}
