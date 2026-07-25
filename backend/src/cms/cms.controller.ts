import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, UseInterceptors, UploadedFile, Res, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { CmsService } from './cms.service.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { Public } from '../common/decorators/public.decorator.js';

@ApiTags('CMS & Storefront Content')
@Controller()
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  // ==========================================
  // PUBLIC STOREFRONT CONTENT SERVICES
  // ==========================================

  @Public()
  @ApiOperation({ summary: 'Get active homepage hero slides' })
  @Get('api/storefront/hero-slides')
  getSlides() {
    return this.cmsService.findAllSlides(false);
  }

  @Public()
  @ApiOperation({ summary: 'Serve raw hero slide image' })
  @Get('api/storefront/hero-slides/:id/image')
  async serveSlideImage(@Param('id') id: string, @Res() res: Response) {
    const file = await this.cmsService.getSlideRaw(id);
    res.setHeader('Content-Type', file.mime);
    return res.send(file.data);
  }

  @Public()
  @ApiOperation({ summary: 'Get active homepage category cards' })
  @Get('api/storefront/category-cards')
  getCards() {
    return this.cmsService.findAllCards();
  }

  @Public()
  @ApiOperation({ summary: 'Get active spotlight testimonials' })
  @Get('api/storefront/testimonials')
  getTestimonials() {
    return this.cmsService.findAllTestimonials();
  }

  @Public()
  @ApiOperation({ summary: 'Serve raw testimonial avatar' })
  @Get('api/storefront/testimonials/:id/avatar')
  async serveTestimonialAvatar(@Param('id') id: string, @Res() res: Response) {
    const file = await this.cmsService.getTestimonialAvatarRaw(id);
    res.setHeader('Content-Type', file.mime);
    return res.send(file.data);
  }

  @Public()
  @ApiOperation({ summary: 'Get FAQ directory' })
  @Get('api/storefront/faq')
  getFaqs() {
    return this.cmsService.findAllFaqs();
  }

  @Public()
  @ApiOperation({ summary: 'List blog posts' })
  @Get('api/storefront/blog')
  getBlogs() {
    return this.cmsService.findAllBlogs(false);
  }

  @Public()
  @ApiOperation({ summary: 'Get blog post details by URL slug' })
  @Get('api/storefront/blog/:slug')
  getBlogBySlug(@Param('slug') slug: string) {
    return this.cmsService.findBlogBySlug(slug);
  }

  @Public()
  @ApiOperation({ summary: 'Serve blog cover image' })
  @Get('api/storefront/blog/:id/cover')
  async serveBlogCover(@Param('id') id: string, @Res() res: Response) {
    const file = await this.cmsService.getBlogCoverRaw(id);
    res.setHeader('Content-Type', file.mime);
    return res.send(file.data);
  }

  @Public()
  @ApiOperation({ summary: 'Get active top header announcements' })
  @Get('api/storefront/announcements')
  getAnnouncements() {
    return this.cmsService.findAllAnnouncements();
  }

  @Public()
  @ApiOperation({ summary: 'Get navigation menu layout by location' })
  @Get('api/storefront/navigation/:location')
  getNavigation(@Param('location') location: string) {
    return this.cmsService.findNavigation(location);
  }

  @Public()
  @ApiOperation({ summary: 'Get footer columns layout' })
  @Get('api/storefront/footer')
  getFooter() {
    return this.cmsService.getFooter();
  }

  @Public()
  @ApiOperation({ summary: 'Get public configuration settings' })
  @Get('api/storefront/settings/:key')
  async getSetting(@Param('key') key: string) {
    const value = await this.cmsService.getSettingValue(key);
    return { key, value };
  }

  @Public()
  @ApiOperation({ summary: 'Get active page content by URL slug' })
  @Get('api/storefront/pages/:slug')
  getPage(@Param('slug') slug: string) {
    return this.cmsService.findPageBySlug(slug);
  }

  // ==========================================
  // ADMINISTRATIVE CMS OPERATIONS
  // ==========================================

  // --- Pages ---
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'List all pages (Admin)' })
  @Get('api/admin/cms/pages')
  adminGetPages() {
    return this.cmsService.findAllPages();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new static page (Admin)' })
  @Post('api/admin/cms/pages')
  adminCreatePage(@Body() dto: any) {
    return this.cmsService.createPage(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update page details (Admin)' })
  @Patch('api/admin/cms/pages/:id')
  adminUpdatePage(@Param('id') id: string, @Body() dto: any) {
    return this.cmsService.updatePage(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete static page (Admin)' })
  @Delete('api/admin/cms/pages/:id')
  adminDeletePage(@Param('id') id: string) {
    return this.cmsService.deletePage(id);
  }

  // --- Page Sections ---
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Add a section to a page (Admin)' })
  @Post('api/admin/cms/pages/:id/sections')
  adminAddSection(@Param('id') pageId: string, @Body() dto: any) {
    return this.cmsService.addPageSection(pageId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update a page section contents (Admin)' })
  @Patch('api/admin/cms/sections/:sid')
  adminUpdateSection(@Param('sid') sectionId: string, @Body() dto: any) {
    return this.cmsService.updatePageSection(sectionId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Remove section from page (Admin)' })
  @Delete('api/admin/cms/sections/:sid')
  adminDeleteSection(@Param('sid') sectionId: string) {
    return this.cmsService.deletePageSection(sectionId);
  }

  // --- Hero Slides ---
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create hero carousel slide (Admin)' })
  @ApiConsumes('multipart/form-data')
  @Post('api/admin/cms/hero-slides')
  @UseInterceptors(FileInterceptor('image'))
  adminCreateSlide(@Body() dto: any, @UploadedFile() file: Express.Multer.File) {
    return this.cmsService.createSlide(dto, file);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update slide details (Admin)' })
  @ApiConsumes('multipart/form-data')
  @Patch('api/admin/cms/hero-slides/:id')
  @UseInterceptors(FileInterceptor('image'))
  adminUpdateSlide(
    @Param('id') id: string,
    @Body() dto: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.cmsService.updateSlide(id, dto, file);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete slide (Admin)' })
  @Delete('api/admin/cms/hero-slides/:id')
  adminDeleteSlide(@Param('id') id: string) {
    return this.cmsService.deleteSlide(id);
  }

  // --- Category Cards ---
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Spotlight a category highlight card (Admin)' })
  @Post('api/admin/cms/category-cards')
  adminCreateCard(@Body() dto: any) {
    return this.cmsService.createCard(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update category card parameters (Admin)' })
  @Patch('api/admin/cms/category-cards/:id')
  adminUpdateCard(@Param('id') id: string, @Body() dto: any) {
    return this.cmsService.updateCard(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Remove spotlight card (Admin)' })
  @Delete('api/admin/cms/category-cards/:id')
  adminDeleteCard(@Param('id') id: string) {
    return this.cmsService.deleteCard(id);
  }

  // --- Testimonials ---
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Add spotlight review (Admin)' })
  @ApiConsumes('multipart/form-data')
  @Post('api/admin/cms/testimonials')
  @UseInterceptors(FileInterceptor('image'))
  adminCreateTestimonial(@Body() dto: any, @UploadedFile() file?: Express.Multer.File) {
    return this.cmsService.createTestimonial(dto, file);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update spotlight review parameters (Admin)' })
  @ApiConsumes('multipart/form-data')
  @Patch('api/admin/cms/testimonials/:id')
  @UseInterceptors(FileInterceptor('image'))
  adminUpdateTestimonial(
    @Param('id') id: string,
    @Body() dto: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.cmsService.updateTestimonial(id, dto, file);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete testimonial (Admin)' })
  @Delete('api/admin/cms/testimonials/:id')
  adminDeleteTestimonial(@Param('id') id: string) {
    return this.cmsService.deleteTestimonial(id);
  }

  // --- FAQs ---
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create FAQ entry (Admin)' })
  @Post('api/admin/cms/faq')
  adminCreateFaq(@Body() dto: any) {
    return this.cmsService.createFaq(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Modify FAQ details (Admin)' })
  @Patch('api/admin/cms/faq/:id')
  adminUpdateFaq(@Param('id') id: string, @Body() dto: any) {
    return this.cmsService.updateFaq(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Remove FAQ entry (Admin)' })
  @Delete('api/admin/cms/faq/:id')
  adminDeleteFaq(@Param('id') id: string) {
    return this.cmsService.deleteFaq(id);
  }

  // --- Blog CMS ---
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Write a new blog post (Admin)' })
  @ApiConsumes('multipart/form-data')
  @Post('api/admin/cms/blog')
  @UseInterceptors(FileInterceptor('image'))
  adminCreateBlog(
    @Body() dto: any,
    @CurrentUser() user: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.cmsService.createBlog(dto, user.id, file);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update article contents (Admin)' })
  @ApiConsumes('multipart/form-data')
  @Patch('api/admin/cms/blog/:id')
  @UseInterceptors(FileInterceptor('image'))
  adminUpdateBlog(
    @Param('id') id: string,
    @Body() dto: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.cmsService.updateBlog(id, dto, file);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Remove blog article (Admin)' })
  @Delete('api/admin/cms/blog/:id')
  adminDeleteBlog(@Param('id') id: string) {
    return this.cmsService.deleteBlog(id);
  }

  // --- Announcements Banners ---
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Configure notification banner (Admin)' })
  @Post('api/admin/cms/announcements')
  adminCreateAnnouncement(@Body() dto: any) {
    return this.cmsService.createAnnouncement(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update banner parameters (Admin)' })
  @Patch('api/admin/cms/announcements/:id')
  adminUpdateAnnouncement(@Param('id') id: string, @Body() dto: any) {
    return this.cmsService.updateAnnouncement(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Remove announcement banner (Admin)' })
  @Delete('api/admin/announcements/:id')
  adminDeleteAnnouncement(@Param('id') id: string) {
    return this.cmsService.deleteAnnouncement(id);
  }

  // --- Navigation Menus ---
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create nav item link (Admin)' })
  @Post('api/admin/cms/navigation')
  adminCreateNav(@Body() dto: any) {
    return this.cmsService.createNavigation(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update nav link parameters (Admin)' })
  @Patch('api/admin/cms/navigation/:id')
  adminUpdateNav(@Param('id') id: string, @Body() dto: any) {
    return this.cmsService.updateNavigation(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete nav item link (Admin)' })
  @Delete('api/admin/cms/navigation/:id')
  adminDeleteNav(@Param('id') id: string) {
    return this.cmsService.deleteNavigation(id);
  }

  // --- Footer ---
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update footer column contents (Admin)' })
  @Patch('api/admin/cms/footer/:id')
  adminUpdateFooter(@Param('id') id: string, @Body() dto: any) {
    return this.cmsService.updateFooterSection(id, dto);
  }

  // --- Configuration settings ---
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'List store config settings (Admin)' })
  @Get('api/admin/settings')
  adminGetSettings(@Query('group') groupName?: string) {
    return this.cmsService.getSettings(groupName);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Modify store configuration setting (Admin)' })
  @Patch('api/admin/settings/:key')
  adminUpdateSetting(
    @Param('key') key: string,
    @Body('value') value: string,
    @Body('group') groupName?: string,
    @Body('description') description?: string,
  ) {
    return this.cmsService.updateSetting(key, value, groupName, description);
  }
}
