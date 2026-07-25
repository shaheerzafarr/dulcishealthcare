import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ContactService } from './contact.service.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { Public } from '../common/decorators/public.decorator.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';

@ApiTags('Contact & Messages')
@Controller()
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Public()
  @ApiOperation({ summary: 'Submit contact message (Storefront)' })
  @Post('api/contact')
  submitMessage(@Body() dto: any) {
    return this.contactService.submitMessage(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'List customer messages (Admin)' })
  @Get('api/admin/contact-messages')
  adminGetMessages(
    @Query() paginationDto: PaginationDto,
    @Query('status') status?: string,
  ) {
    return this.contactService.findAll(paginationDto, status);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Get message details (Admin)' })
  @Get('api/admin/contact-messages/:id')
  adminGetMessage(@Param('id') id: string) {
    return this.contactService.findById(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Modify message status/staff assignment (Admin)' })
  @Patch('api/admin/contact-messages/:id')
  adminUpdateMessage(
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('assignedTo') assignedTo?: string,
  ) {
    return this.contactService.updateStatus(id, status, assignedTo);
  }
}
