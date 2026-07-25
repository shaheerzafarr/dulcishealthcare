import { Controller, Get, Post, Delete, Param, Query, UseGuards, UseInterceptors, UploadedFile, Res, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { MediaService } from './media.service.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { Public } from '../common/decorators/public.decorator.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';

@ApiTags('Media Library')
@Controller()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Public()
  @ApiOperation({ summary: 'Serve raw media file directly (BYTEA)' })
  @Get('api/media/:id')
  async serveFile(@Param('id') id: string, @Res() res: Response) {
    const file = await this.mediaService.getRawFile(id);
    res.setHeader('Content-Type', file.mime);
    return res.send(file.data);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'List media files (Admin)' })
  @Get('api/admin/media')
  adminGetFiles(
    @Query() paginationDto: PaginationDto,
    @Query('folder') folder?: string,
  ) {
    return this.mediaService.findAll(paginationDto, folder);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Upload file to media library (Admin)' })
  @ApiConsumes('multipart/form-data')
  @Post('api/admin/media/upload')
  @UseInterceptors(FileInterceptor('file'))
  adminUploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder?: string,
    @Body('altText') altText?: string,
  ) {
    return this.mediaService.uploadFile(file, folder, altText);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete file from media library (Admin)' })
  @Delete('api/admin/media/:id')
  adminDeleteFile(@Param('id') id: string) {
    return this.mediaService.deleteFile(id);
  }
}
