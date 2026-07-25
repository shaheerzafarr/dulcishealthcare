import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ShippingService } from './shipping.service.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { Public } from '../common/decorators/public.decorator.js';

@ApiTags('Shipping & Taxes')
@Controller()
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  // ==========================================
  // PUBLIC RATES FOR CHECKOUT
  // ==========================================

  @Public()
  @ApiOperation({ summary: 'List all active shipping rates' })
  @Get('api/shipping/rates')
  getRates() {
    return this.shippingService.findAllRates();
  }

  // ==========================================
  // ADMINISTRATIVE CONFIGURATION
  // ==========================================

  // --- Shipping Zones ---
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'List all shipping zones (Admin)' })
  @Get('api/admin/shipping/zones')
  adminGetZones() {
    return this.shippingService.findAllZones();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create shipping zone (Admin)' })
  @Post('api/admin/shipping/zones')
  adminCreateZone(@Body() dto: any) {
    return this.shippingService.createZone(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update shipping zone details (Admin)' })
  @Patch('api/admin/shipping/zones/:id')
  adminUpdateZone(@Param('id') id: string, @Body() dto: any) {
    return this.shippingService.updateZone(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Remove shipping zone (Admin)' })
  @Delete('api/admin/shipping/zones/:id')
  adminDeleteZone(@Param('id') id: string) {
    return this.shippingService.deleteZone(id);
  }

  // --- Shipping Rates ---
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'List all shipping rates (Admin)' })
  @Get('api/admin/shipping/rates')
  adminGetRates() {
    return this.shippingService.findAllRates();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create shipping rate in zone (Admin)' })
  @Post('api/admin/shipping/rates')
  adminCreateRate(@Body() dto: any) {
    return this.shippingService.createRate(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update shipping rate details (Admin)' })
  @Patch('api/admin/shipping/rates/:id')
  adminUpdateRate(@Param('id') id: string, @Body() dto: any) {
    return this.shippingService.updateRate(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Remove shipping rate (Admin)' })
  @Delete('api/admin/shipping/rates/:id')
  adminDeleteRate(@Param('id') id: string) {
    return this.shippingService.deleteRate(id);
  }

  // --- Taxes Configuration ---
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'List all tax rules (Admin)' })
  @Get('api/admin/taxes')
  adminGetTaxes() {
    return this.shippingService.findAllTaxes();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create tax rule (Admin)' })
  @Post('api/admin/taxes')
  adminCreateTax(@Body() dto: any) {
    return this.shippingService.createTax(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update tax rule details (Admin)' })
  @Patch('api/admin/taxes/:id')
  adminUpdateTax(@Param('id') id: string, @Body() dto: any) {
    return this.shippingService.updateTax(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Remove tax rule (Admin)' })
  @Delete('api/admin/taxes/:id')
  adminDeleteTax(@Param('id') id: string) {
    return this.shippingService.deleteTax(id);
  }
}
