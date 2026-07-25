import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, UseInterceptors, UploadedFile, Res, HttpCode, HttpStatus, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { OrdersService } from './orders.service.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';

import { CheckoutDto } from './dto/checkout.dto.js';
import { OrderStatusDto } from './dto/order-status.dto.js';
import { CreateReturnDto } from './dto/create-return.dto.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';

@ApiTags('Orders & Fulfillment')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // ==========================================
  // CUSTOMER ROUTING
  // ==========================================

  @ApiOperation({ summary: 'Checkout cart and create order' })
  @Post('api/orders/checkout')
  checkout(@CurrentUser() user: any, @Body() dto: CheckoutDto) {
    return this.ordersService.checkout(user.id, dto);
  }

  @ApiOperation({ summary: 'Get current user orders' })
  @Get('api/orders')
  getMyOrders(@CurrentUser() user: any, @Query() paginationDto: PaginationDto) {
    return this.ordersService.findMyOrders(user.id, paginationDto);
  }

  @ApiOperation({ summary: 'Get order details by ID' })
  @Get('api/orders/:id')
  async getMyOrder(@CurrentUser() user: any, @Param('id') id: string) {
    const order = await this.ordersService.findOne(id);
    if (order.userId !== user.id) {
      throw new ForbiddenException('Access denied');
    }
    return order;
  }

  @ApiOperation({ summary: 'Request return for delivered order' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @Post('api/orders/:id/returns')
  requestReturn(
    @CurrentUser() user: any,
    @Param('id') orderId: string,
    @Body() dto: CreateReturnDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.ordersService.requestReturn(user.id, orderId, dto, file);
  }

  // ==========================================
  // ADMINISTRATIVE CONFIGURATION ROUTING
  // ==========================================

  // --- Orders Fulfillment ---
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'List all orders (Admin)' })
  @Get('api/admin/orders')
  adminGetOrders(
    @Query() paginationDto: PaginationDto,
    @Query('status') status?: string,
  ) {
    return this.ordersService.findAll(paginationDto, status);
  }

  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Get order details (Admin)' })
  @Get('api/admin/orders/:id')
  adminGetOrder(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Roles('admin')
  @ApiOperation({ summary: 'Update order status and history timeline (Admin)' })
  @Patch('api/admin/orders/:id/status')
  adminUpdateStatus(
    @Param('id') id: string,
    @Body() dto: OrderStatusDto,
    @CurrentUser() user: any,
  ) {
    return this.ordersService.updateStatus(id, dto, user.id);
  }

  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Update courier tracking (Admin)' })
  @Patch('api/admin/orders/:id/tracking')
  adminUpdateTracking(@Param('id') id: string, @Body() trackingData: any) {
    return this.ordersService.updateTracking(id, trackingData);
  }

  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Update internal admin notes (Admin)' })
  @Patch('api/admin/orders/:id/notes')
  adminUpdateNotes(@Param('id') id: string, @Body('notes') notes: string) {
    return this.ordersService.updateAdminNotes(id, notes);
  }

  // --- Invoices ---
  @Roles('admin')
  @ApiOperation({ summary: 'Generate invoice for order (Admin)' })
  @Post('api/admin/orders/:id/invoice')
  adminCreateInvoice(@Param('id') orderId: string) {
    return this.ordersService.createInvoice(orderId);
  }

  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'List all invoices (Admin)' })
  @Get('api/admin/invoices')
  adminGetInvoices() {
    return this.ordersService.findAllInvoices();
  }

  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Serve raw invoice PDF (Admin)' })
  @Get('api/admin/invoices/:id/pdf')
  async serveInvoicePdf(@Param('id') invoiceId: string, @Res() res: Response) {
    const file = await this.ordersService.getInvoicePdf(invoiceId);
    res.setHeader('Content-Type', file.mime);
    return res.send(file.data);
  }

  // --- Returns & Refunds ---
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'List all returns (Admin)' })
  @Get('api/admin/returns')
  adminGetReturns() {
    return this.ordersService.findAllReturns();
  }

  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Serve return proof photo (Admin)' })
  @Get('api/admin/returns/:id/proof')
  async serveReturnProof(@Param('id') returnId: string, @Res() res: Response) {
    const file = await this.ordersService.getReturnProofImage(returnId);
    res.setHeader('Content-Type', file.mime);
    return res.send(file.data);
  }

  @Roles('admin')
  @ApiOperation({ summary: 'Approve/Reject customer return request (Admin)' })
  @Patch('api/admin/returns/:id/status')
  adminUpdateReturnStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('adminNotes') adminNotes?: string,
  ) {
    return this.ordersService.updateReturnStatus(id, status, adminNotes);
  }

  @Roles('admin')
  @ApiOperation({ summary: 'Process refund for order (Admin)' })
  @Post('api/admin/orders/:id/refund')
  adminProcessRefund(
    @Param('id') id: string,
    @Body('amount') amount: number,
    @Body('reason') reason?: string,
    @Body('returnId') returnId?: string,
  ) {
    return this.ordersService.processRefund(id, amount, reason, returnId);
  }

  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'List all processed refunds (Admin)' })
  @Get('api/admin/refunds')
  adminGetRefunds() {
    return this.ordersService.findAllRefunds();
  }
}
