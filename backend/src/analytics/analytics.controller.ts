import { Controller, Get, Post, Body, Query, UseGuards, Req, Ip } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { AnalyticsService } from './analytics.service.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { Public } from '../common/decorators/public.decorator.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';

@ApiTags('Analytics & Tracking')
@Controller()
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly jwtService: JwtService,
  ) {}

  // ==========================================
  // SHOPPER PORTAL ENDPOINTS (Public)
  // ==========================================

  @Public()
  @ApiOperation({ summary: 'Register shopper session landing' })
  @Post('api/analytics/session')
  async startSession(
    @Req() req: any,
    @Ip() ipAddress: string,
    @Body('sessionId') sessionId: string,
    @Body('referrer') referrer?: string,
    @Body('landingPage') landingPage?: string,
    @Body('deviceType') deviceType?: string,
    @Body('country') country?: string,
    @Body('city') city?: string,
    @Body('utmTags') utmTags?: any,
  ) {
    const userAgent = req.headers['user-agent'] || '';
    
    // Optionally identify user from JWT authorization header
    let userId: string | null = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const decoded = this.jwtService.decode(token) as any;
        if (decoded && decoded.sub) {
          userId = decoded.sub;
        }
      } catch (err) {
        // Safe fallback
      }
    }

    return this.analyticsService.startSession(
      userId,
      sessionId,
      ipAddress,
      userAgent,
      referrer || '',
      landingPage || '',
      deviceType || 'desktop',
      country,
      city,
      utmTags,
    );
  }

  @Public()
  @ApiOperation({ summary: 'Log analytics events & dispatch Meta CAPI server-side' })
  @Post('api/analytics/event')
  async trackEvent(
    @Req() req: any,
    @Body('sessionId') sessionId: string,
    @Body('eventName') eventName: string,
    @Body('platform') platform: string,
    @Body('eventData') eventData?: any,
  ) {
    let userId: string | null = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const decoded = this.jwtService.decode(token) as any;
        if (decoded && decoded.sub) {
          userId = decoded.sub;
        }
      } catch (err) {
        // Safe fallback
      }
    }

    return this.analyticsService.trackEvent(userId, sessionId, eventName, platform, eventData);
  }

  // ==========================================
  // ADMINISTRATIVE REPORTINGS
  // ==========================================

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Get general sales & tracking metrics dashboard (Admin)' })
  @Get('api/admin/analytics/overview')
  adminGetOverview(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.analyticsService.getOverviewStats(startDate, endDate);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'List customer sessions (Admin)' })
  @Get('api/admin/analytics/sessions')
  adminGetSessions(@Query() paginationDto: PaginationDto) {
    return this.analyticsService.getSessions(paginationDto);
  }
}
