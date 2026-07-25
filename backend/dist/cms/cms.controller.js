"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CmsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const cms_service_js_1 = require("./cms.service.js");
const jwt_auth_guard_js_1 = require("../common/guards/jwt-auth.guard.js");
const roles_guard_js_1 = require("../common/guards/roles.guard.js");
const roles_decorator_js_1 = require("../common/decorators/roles.decorator.js");
const current_user_decorator_js_1 = require("../common/decorators/current-user.decorator.js");
const public_decorator_js_1 = require("../common/decorators/public.decorator.js");
let CmsController = class CmsController {
    cmsService;
    constructor(cmsService) {
        this.cmsService = cmsService;
    }
    getSlides() {
        return this.cmsService.findAllSlides(false);
    }
    async serveSlideImage(id, res) {
        const file = await this.cmsService.getSlideRaw(id);
        res.setHeader('Content-Type', file.mime);
        return res.send(file.data);
    }
    getCards() {
        return this.cmsService.findAllCards();
    }
    getTestimonials() {
        return this.cmsService.findAllTestimonials();
    }
    async serveTestimonialAvatar(id, res) {
        const file = await this.cmsService.getTestimonialAvatarRaw(id);
        res.setHeader('Content-Type', file.mime);
        return res.send(file.data);
    }
    getFaqs() {
        return this.cmsService.findAllFaqs();
    }
    getBlogs() {
        return this.cmsService.findAllBlogs(false);
    }
    getBlogBySlug(slug) {
        return this.cmsService.findBlogBySlug(slug);
    }
    async serveBlogCover(id, res) {
        const file = await this.cmsService.getBlogCoverRaw(id);
        res.setHeader('Content-Type', file.mime);
        return res.send(file.data);
    }
    getAnnouncements() {
        return this.cmsService.findAllAnnouncements();
    }
    getNavigation(location) {
        return this.cmsService.findNavigation(location);
    }
    getFooter() {
        return this.cmsService.getFooter();
    }
    async getSetting(key) {
        const value = await this.cmsService.getSettingValue(key);
        return { key, value };
    }
    getPage(slug) {
        return this.cmsService.findPageBySlug(slug);
    }
    adminGetPages() {
        return this.cmsService.findAllPages();
    }
    adminCreatePage(dto) {
        return this.cmsService.createPage(dto);
    }
    adminUpdatePage(id, dto) {
        return this.cmsService.updatePage(id, dto);
    }
    adminDeletePage(id) {
        return this.cmsService.deletePage(id);
    }
    adminAddSection(pageId, dto) {
        return this.cmsService.addPageSection(pageId, dto);
    }
    adminUpdateSection(sectionId, dto) {
        return this.cmsService.updatePageSection(sectionId, dto);
    }
    adminDeleteSection(sectionId) {
        return this.cmsService.deletePageSection(sectionId);
    }
    adminCreateSlide(dto, file) {
        return this.cmsService.createSlide(dto, file);
    }
    adminUpdateSlide(id, dto, file) {
        return this.cmsService.updateSlide(id, dto, file);
    }
    adminDeleteSlide(id) {
        return this.cmsService.deleteSlide(id);
    }
    adminCreateCard(dto) {
        return this.cmsService.createCard(dto);
    }
    adminUpdateCard(id, dto) {
        return this.cmsService.updateCard(id, dto);
    }
    adminDeleteCard(id) {
        return this.cmsService.deleteCard(id);
    }
    adminCreateTestimonial(dto, file) {
        return this.cmsService.createTestimonial(dto, file);
    }
    adminUpdateTestimonial(id, dto, file) {
        return this.cmsService.updateTestimonial(id, dto, file);
    }
    adminDeleteTestimonial(id) {
        return this.cmsService.deleteTestimonial(id);
    }
    adminCreateFaq(dto) {
        return this.cmsService.createFaq(dto);
    }
    adminUpdateFaq(id, dto) {
        return this.cmsService.updateFaq(id, dto);
    }
    adminDeleteFaq(id) {
        return this.cmsService.deleteFaq(id);
    }
    adminCreateBlog(dto, user, file) {
        return this.cmsService.createBlog(dto, user.id, file);
    }
    adminUpdateBlog(id, dto, file) {
        return this.cmsService.updateBlog(id, dto, file);
    }
    adminDeleteBlog(id) {
        return this.cmsService.deleteBlog(id);
    }
    adminCreateAnnouncement(dto) {
        return this.cmsService.createAnnouncement(dto);
    }
    adminUpdateAnnouncement(id, dto) {
        return this.cmsService.updateAnnouncement(id, dto);
    }
    adminDeleteAnnouncement(id) {
        return this.cmsService.deleteAnnouncement(id);
    }
    adminCreateNav(dto) {
        return this.cmsService.createNavigation(dto);
    }
    adminUpdateNav(id, dto) {
        return this.cmsService.updateNavigation(id, dto);
    }
    adminDeleteNav(id) {
        return this.cmsService.deleteNavigation(id);
    }
    adminUpdateFooter(id, dto) {
        return this.cmsService.updateFooterSection(id, dto);
    }
    adminGetSettings(groupName) {
        return this.cmsService.getSettings(groupName);
    }
    adminUpdateSetting(key, value, groupName, description) {
        return this.cmsService.updateSetting(key, value, groupName, description);
    }
};
exports.CmsController = CmsController;
__decorate([
    (0, public_decorator_js_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get active homepage hero slides' }),
    (0, common_1.Get)('api/storefront/hero-slides'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "getSlides", null);
__decorate([
    (0, public_decorator_js_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Serve raw hero slide image' }),
    (0, common_1.Get)('api/storefront/hero-slides/:id/image'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CmsController.prototype, "serveSlideImage", null);
__decorate([
    (0, public_decorator_js_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get active homepage category cards' }),
    (0, common_1.Get)('api/storefront/category-cards'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "getCards", null);
__decorate([
    (0, public_decorator_js_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get active spotlight testimonials' }),
    (0, common_1.Get)('api/storefront/testimonials'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "getTestimonials", null);
__decorate([
    (0, public_decorator_js_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Serve raw testimonial avatar' }),
    (0, common_1.Get)('api/storefront/testimonials/:id/avatar'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CmsController.prototype, "serveTestimonialAvatar", null);
__decorate([
    (0, public_decorator_js_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get FAQ directory' }),
    (0, common_1.Get)('api/storefront/faq'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "getFaqs", null);
__decorate([
    (0, public_decorator_js_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'List blog posts' }),
    (0, common_1.Get)('api/storefront/blog'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "getBlogs", null);
__decorate([
    (0, public_decorator_js_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get blog post details by URL slug' }),
    (0, common_1.Get)('api/storefront/blog/:slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "getBlogBySlug", null);
__decorate([
    (0, public_decorator_js_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Serve blog cover image' }),
    (0, common_1.Get)('api/storefront/blog/:id/cover'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CmsController.prototype, "serveBlogCover", null);
__decorate([
    (0, public_decorator_js_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get active top header announcements' }),
    (0, common_1.Get)('api/storefront/announcements'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "getAnnouncements", null);
__decorate([
    (0, public_decorator_js_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get navigation menu layout by location' }),
    (0, common_1.Get)('api/storefront/navigation/:location'),
    __param(0, (0, common_1.Param)('location')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "getNavigation", null);
__decorate([
    (0, public_decorator_js_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get footer columns layout' }),
    (0, common_1.Get)('api/storefront/footer'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "getFooter", null);
__decorate([
    (0, public_decorator_js_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get public configuration settings' }),
    (0, common_1.Get)('api/storefront/settings/:key'),
    __param(0, (0, common_1.Param)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CmsController.prototype, "getSetting", null);
__decorate([
    (0, public_decorator_js_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get active page content by URL slug' }),
    (0, common_1.Get)('api/storefront/pages/:slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "getPage", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin', 'manager'),
    (0, swagger_1.ApiOperation)({ summary: 'List all pages (Admin)' }),
    (0, common_1.Get)('api/admin/cms/pages'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "adminGetPages", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new static page (Admin)' }),
    (0, common_1.Post)('api/admin/cms/pages'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "adminCreatePage", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Update page details (Admin)' }),
    (0, common_1.Patch)('api/admin/cms/pages/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "adminUpdatePage", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete static page (Admin)' }),
    (0, common_1.Delete)('api/admin/cms/pages/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "adminDeletePage", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Add a section to a page (Admin)' }),
    (0, common_1.Post)('api/admin/cms/pages/:id/sections'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "adminAddSection", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a page section contents (Admin)' }),
    (0, common_1.Patch)('api/admin/cms/sections/:sid'),
    __param(0, (0, common_1.Param)('sid')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "adminUpdateSection", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove section from page (Admin)' }),
    (0, common_1.Delete)('api/admin/cms/sections/:sid'),
    __param(0, (0, common_1.Param)('sid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "adminDeleteSection", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Create hero carousel slide (Admin)' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.Post)('api/admin/cms/hero-slides'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "adminCreateSlide", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Update slide details (Admin)' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.Patch)('api/admin/cms/hero-slides/:id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "adminUpdateSlide", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete slide (Admin)' }),
    (0, common_1.Delete)('api/admin/cms/hero-slides/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "adminDeleteSlide", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Spotlight a category highlight card (Admin)' }),
    (0, common_1.Post)('api/admin/cms/category-cards'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "adminCreateCard", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Update category card parameters (Admin)' }),
    (0, common_1.Patch)('api/admin/cms/category-cards/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "adminUpdateCard", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove spotlight card (Admin)' }),
    (0, common_1.Delete)('api/admin/cms/category-cards/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "adminDeleteCard", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Add spotlight review (Admin)' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.Post)('api/admin/cms/testimonials'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "adminCreateTestimonial", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Update spotlight review parameters (Admin)' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.Patch)('api/admin/cms/testimonials/:id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "adminUpdateTestimonial", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete testimonial (Admin)' }),
    (0, common_1.Delete)('api/admin/cms/testimonials/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "adminDeleteTestimonial", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Create FAQ entry (Admin)' }),
    (0, common_1.Post)('api/admin/cms/faq'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "adminCreateFaq", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Modify FAQ details (Admin)' }),
    (0, common_1.Patch)('api/admin/cms/faq/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "adminUpdateFaq", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove FAQ entry (Admin)' }),
    (0, common_1.Delete)('api/admin/cms/faq/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "adminDeleteFaq", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Write a new blog post (Admin)' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.Post)('api/admin/cms/blog'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_js_1.CurrentUser)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "adminCreateBlog", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Update article contents (Admin)' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.Patch)('api/admin/cms/blog/:id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "adminUpdateBlog", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove blog article (Admin)' }),
    (0, common_1.Delete)('api/admin/cms/blog/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "adminDeleteBlog", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Configure notification banner (Admin)' }),
    (0, common_1.Post)('api/admin/cms/announcements'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "adminCreateAnnouncement", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Update banner parameters (Admin)' }),
    (0, common_1.Patch)('api/admin/cms/announcements/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "adminUpdateAnnouncement", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove announcement banner (Admin)' }),
    (0, common_1.Delete)('api/admin/announcements/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "adminDeleteAnnouncement", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Create nav item link (Admin)' }),
    (0, common_1.Post)('api/admin/cms/navigation'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "adminCreateNav", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Update nav link parameters (Admin)' }),
    (0, common_1.Patch)('api/admin/cms/navigation/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "adminUpdateNav", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete nav item link (Admin)' }),
    (0, common_1.Delete)('api/admin/cms/navigation/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "adminDeleteNav", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Update footer column contents (Admin)' }),
    (0, common_1.Patch)('api/admin/cms/footer/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "adminUpdateFooter", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin', 'manager'),
    (0, swagger_1.ApiOperation)({ summary: 'List store config settings (Admin)' }),
    (0, common_1.Get)('api/admin/settings'),
    __param(0, (0, common_1.Query)('group')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "adminGetSettings", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Modify store configuration setting (Admin)' }),
    (0, common_1.Patch)('api/admin/settings/:key'),
    __param(0, (0, common_1.Param)('key')),
    __param(1, (0, common_1.Body)('value')),
    __param(2, (0, common_1.Body)('group')),
    __param(3, (0, common_1.Body)('description')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], CmsController.prototype, "adminUpdateSetting", null);
exports.CmsController = CmsController = __decorate([
    (0, swagger_1.ApiTags)('CMS & Storefront Content'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [cms_service_js_1.CmsService])
], CmsController);
//# sourceMappingURL=cms.controller.js.map