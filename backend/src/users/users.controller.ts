import { Controller, Get, Patch, Post, Delete, Body, Param, Query, UseGuards, Put } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { CreateAddressDto } from './dto/create-address.dto.js';
import { UpdateAddressDto } from './dto/update-address.dto.js';
import { UpdateNotificationPreferenceDto } from './dto/update-notification.dto.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ==========================================
  // CUSTOMER ROUTING
  // ==========================================

  @ApiOperation({ summary: 'Get current user profile' })
  @Get('api/users/profile')
  getProfile(@CurrentUser() user: any) {
    return this.usersService.findById(user.id);
  }

  @ApiOperation({ summary: 'Update profile information' })
  @Patch('api/users/profile')
  updateProfile(@CurrentUser() user: any, @Body() updateDto: UpdateUserDto) {
    // Prevent customer from changing validation/active status
    delete updateDto.isActive;
    delete updateDto.isVerified;
    return this.usersService.update(user.id, updateDto);
  }

  @ApiOperation({ summary: 'Change password' })
  @Post('api/users/change-password')
  changePassword(@CurrentUser() user: any, @Body() changeDto: any) {
    return this.usersService.changePassword(user.id, changeDto);
  }

  @ApiOperation({ summary: 'Add a new shipping address' })
  @Post('api/users/addresses')
  addAddress(@CurrentUser() user: any, @Body() createAddressDto: CreateAddressDto) {
    return this.usersService.addAddress(user.id, createAddressDto);
  }

  @ApiOperation({ summary: 'Update address details' })
  @Patch('api/users/addresses/:id')
  updateAddress(
    @CurrentUser() user: any,
    @Param('id') addressId: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return this.usersService.updateAddress(user.id, addressId, updateAddressDto);
  }

  @ApiOperation({ summary: 'Delete shipping address' })
  @Delete('api/users/addresses/:id')
  deleteAddress(@CurrentUser() user: any, @Param('id') addressId: string) {
    return this.usersService.deleteAddress(user.id, addressId);
  }

  @ApiOperation({ summary: 'Update user notification preference' })
  @Patch('api/users/notifications')
  updateNotifications(
    @CurrentUser() user: any,
    @Body() updateDto: UpdateNotificationPreferenceDto,
  ) {
    return this.usersService.updateNotificationPrefs(user.id, updateDto);
  }

  // ==========================================
  // ADMINISTRATIVE ROUTING
  // ==========================================

  @ApiOperation({ summary: 'List all users (Admin)' })
  @Roles('admin', 'manager')
  @Get('api/admin/users')
  findAll(@Query() paginationDto: PaginationDto) {
    return this.usersService.findAll(paginationDto);
  }

  @ApiOperation({ summary: 'Get user details by ID (Admin)' })
  @Roles('admin', 'manager')
  @Get('api/admin/users/:id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @ApiOperation({ summary: 'Modify user details (Admin)' })
  @Roles('admin')
  @Patch('api/admin/users/:id')
  adminUpdate(@Param('id') id: string, @Body() updateDto: UpdateUserDto) {
    return this.usersService.update(id, updateDto);
  }

  @ApiOperation({ summary: 'Soft delete user (Admin)' })
  @Roles('admin')
  @Delete('api/admin/users/:id')
  adminDelete(@Param('id') id: string) {
    return this.usersService.update(id, { isActive: false });
  }
}
