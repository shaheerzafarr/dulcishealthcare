import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { MarketingService } from './marketing.service.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { Public } from '../common/decorators/public.decorator.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';

@ApiTags('Marketing & Promotions')
@Controller()
export class MarketingController {
  constructor(
    private readonly marketingService: MarketingService,
    private readonly jwtService: JwtService,
  ) {}

  // ==========================================
  // SHOPPER PORTAL (Public storefront)
  // ==========================================

  @Public()
  @ApiOperation({ summary: 'Validate coupon applicability and calculate discount' })
  @Post('api/coupons/validate')
  async validate(
    @Req() req: any,
    @Body('code') code: string,
    @Body('subtotal') subtotal: number,
    @Body('productIds') productIds?: string[],
    @Body('categoryIds') categoryIds?: string[],
  ) {
    // Optionally check if auth header is present and decode user
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
        // Fallback to guest validation
      }
    }

    return this.marketingService.validateCoupon(
      code,
      userId || '',
      subtotal,
      productIds || [],
      categoryIds || [],
    );
  }

  @Public()
  @ApiOperation({ summary: 'Subscribe email to newsletter list' })
  @Post('api/newsletter/subscribe')
  subscribe(
    @Body('email') email: string,
    @Body('firstName') firstName?: string,
    @Body('source') source?: string,
  ) {
    return this.marketingService.subscribeNewsletter(email, firstName, source);
  }

  @Public()
  @ApiOperation({ summary: 'Unsubscribe email from newsletter' })
  @Post('api/newsletter/unsubscribe')
  unsubscribe(@Body('email') email: string) {
    return this.marketingService.unsubscribeNewsletter(email);
  }

  // ==========================================
  // ADMINISTRATIVE CONFIGURATIONS
  // ==========================================

  // --- Coupons CRUD ---
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'List all promo coupons (Admin)' })
  @Get('api/admin/coupons')
  adminGetCoupons() {
    return this.marketingService.findAllCoupons();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create new promo coupon (Admin)' })
  @Post('api/admin/coupons')
  adminCreateCoupon(@Body() dto: any) {
    return this.marketingService.createCoupon(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Modify coupon rules (Admin)' })
  @Patch('api/admin/coupons/:id')
  adminUpdateCoupon(@Param('id') id: string, @Body() dto: any) {
    return this.marketingService.updateCoupon(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete promo coupon (Admin)' })
  @Delete('api/admin/coupons/:id')
  adminDeleteCoupon(@Param('id') id: string) {
    return this.marketingService.deleteCoupon(id);
  }

  // --- Automatic Markdown Discounts CRUD ---
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'List automatic markdown discounts (Admin)' })
  @Get('api/admin/discounts')
  adminGetDiscounts() {
    return this.marketingService.findAllDiscounts();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create automatic markdown discount rule (Admin)' })
  @Post('api/admin/discounts')
  adminCreateDiscount(@Body() dto: any) {
    return this.marketingService.createDiscount(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Modify automatic discount details (Admin)' })
  @Patch('api/admin/discounts/:id')
  adminUpdateDiscount(@Param('id') id: string, @Body() dto: any) {
    return this.marketingService.updateDiscount(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete discount rule (Admin)' })
  @Delete('api/admin/discounts/:id')
  adminDeleteDiscount(@Param('id') id: string) {
    return this.marketingService.deleteDiscount(id);
  }

  // --- Flash Sales CRUD ---
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'List active and scheduled flash sales (Admin)' })
  @Get('api/admin/flash-sales')
  adminGetFlashSales() {
    return this.marketingService.findAllFlashSales();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create time-sensitive flash sale event (Admin)' })
  @Post('api/admin/flash-sales')
  adminCreateFlashSale(@Body() dto: any) {
    return this.marketingService.createFlashSale(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Modify flash sale parameters (Admin)' })
  @Patch('api/admin/flash-sales/:id')
  adminUpdateFlashSale(@Param('id') id: string, @Body() dto: any) {
    return this.marketingService.updateFlashSale(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Cancel/Delete flash sale event (Admin)' })
  @Delete('api/admin/flash-sales/:id')
  adminDeleteFlashSale(@Param('id') id: string) {
    return this.marketingService.deleteFlashSale(id);
  }

  // --- Newsletter Subscribers ---
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'List newsletter subscribers (Admin)' })
  @Get('api/admin/newsletter/subscribers')
  adminGetSubscribers(@Query() paginationDto: PaginationDto) {
    return this.marketingService.findAllSubscribers(paginationDto);
  }

  // --- Abandoned Carts & Email reminders ---
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'List abandoned customer carts (Admin)' })
  @Get('api/admin/abandoned-carts')
  adminGetAbandonedCarts(
    @Query() paginationDto: PaginationDto,
    @Query('unrecovered') unrecovered?: string,
  ) {
    const unrecoveredOnly = unrecovered === 'true';
    return this.marketingService.findAllAbandonedCarts(paginationDto, unrecoveredOnly);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Dispatch recovery emails to abandoned checkouts (Admin)' })
  @Post('api/admin/abandoned-carts/send-reminders')
  adminSendReminders() {
    return this.marketingService.triggerRecoveryEmails();
  }
}
