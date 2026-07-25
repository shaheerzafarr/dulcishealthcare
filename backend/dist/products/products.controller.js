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
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const products_service_js_1 = require("./products.service.js");
const jwt_auth_guard_js_1 = require("../common/guards/jwt-auth.guard.js");
const roles_guard_js_1 = require("../common/guards/roles.guard.js");
const roles_decorator_js_1 = require("../common/decorators/roles.decorator.js");
const current_user_decorator_js_1 = require("../common/decorators/current-user.decorator.js");
const public_decorator_js_1 = require("../common/decorators/public.decorator.js");
const create_product_dto_js_1 = require("./dto/create-product.dto.js");
const update_product_dto_js_1 = require("./dto/update-product.dto.js");
const create_category_dto_js_1 = require("./dto/create-category.dto.js");
const update_category_dto_js_1 = require("./dto/update-category.dto.js");
const create_variant_dto_js_1 = require("./dto/create-variant.dto.js");
const update_variant_dto_js_1 = require("./dto/update-variant.dto.js");
const create_review_dto_js_1 = require("./dto/create-review.dto.js");
const add_cart_item_dto_js_1 = require("./dto/add-cart-item.dto.js");
const pagination_dto_js_1 = require("../common/dto/pagination.dto.js");
let ProductsController = class ProductsController {
    productsService;
    constructor(productsService) {
        this.productsService = productsService;
    }
    getCategories() {
        return this.productsService.findAllCategories(false);
    }
    async serveCategoryImage(id, res) {
        const file = await this.productsService.getCategoryRaw(id);
        res.setHeader('Content-Type', file.mime);
        return res.send(file.data);
    }
    getProducts(paginationDto, categorySlug, search, sort) {
        return this.productsService.findAllProducts(paginationDto, categorySlug, search, sort, false);
    }
    getProductBySlug(slug) {
        return this.productsService.findProductBySlug(slug);
    }
    async serveProductImage(imageId, res) {
        const file = await this.productsService.getProductImageRaw(imageId);
        res.setHeader('Content-Type', file.mime);
        return res.send(file.data);
    }
    createReview(user, dto) {
        return this.productsService.createReview(user.id, dto);
    }
    getWishlist(user) {
        return this.productsService.getWishlist(user.id);
    }
    addToWishlist(user, productId) {
        return this.productsService.addToWishlist(user.id, productId);
    }
    removeFromWishlist(user, productId) {
        return this.productsService.removeFromWishlist(user.id, productId);
    }
    async getCart(req) {
        const user = req.user;
        const sessionId = req.query.sessionId;
        return this.productsService.getCart(user?.id, sessionId);
    }
    async addToCart(req, dto) {
        const user = req.user;
        const sessionId = req.query.sessionId;
        return this.productsService.addToCart(user?.id, sessionId, dto);
    }
    async updateCartItem(itemId, quantity) {
        return this.productsService.updateCartItem(itemId, quantity);
    }
    async removeCartItem(itemId) {
        return this.productsService.removeCartItem(itemId);
    }
    async clearCart(req) {
        const user = req.user;
        const sessionId = req.query.sessionId;
        return this.productsService.clearCart(user?.id, sessionId);
    }
    adminGetProducts(paginationDto, categorySlug, search) {
        return this.productsService.findAllProducts(paginationDto, categorySlug, search, undefined, true);
    }
    adminGetProduct(id) {
        return this.productsService.findProductById(id);
    }
    adminCreateProduct(dto) {
        return this.productsService.createProduct(dto);
    }
    adminUpdateProduct(id, dto) {
        return this.productsService.updateProduct(id, dto);
    }
    adminDeleteProduct(id) {
        return this.productsService.softDeleteProduct(id);
    }
    adminUploadPrimaryImage(productId, file) {
        return this.productsService.uploadProductImage(productId, file, true);
    }
    adminUploadGalleryImage(productId, file, caption) {
        return this.productsService.uploadProductGallery(productId, file, caption);
    }
    adminDeleteImage(imageId) {
        return this.productsService.deleteProductImage(imageId);
    }
    adminCreateCategory(dto, file) {
        return this.productsService.createCategory(dto, file);
    }
    adminUpdateCategory(id, dto, file) {
        return this.productsService.updateCategory(id, dto, file);
    }
    adminDeleteCategory(id) {
        return this.productsService.deleteCategory(id);
    }
    adminAddVariant(productId, dto) {
        return this.productsService.addVariant(productId, dto);
    }
    adminUpdateVariant(variantId, dto) {
        return this.productsService.updateVariant(variantId, dto);
    }
    adminDeleteVariant(variantId) {
        return this.productsService.deleteVariant(variantId);
    }
    adminGetInventory() {
        return this.productsService.getFullInventory();
    }
    adminUpdateInventory(variantId, quantity) {
        return this.productsService.updateInventory(variantId, quantity);
    }
    adminGetReviews(paginationDto, isApproved) {
        return this.productsService.findAllReviews(paginationDto, isApproved);
    }
    adminApproveReview(id) {
        return this.productsService.approveReview(id, true);
    }
    adminRejectReview(id) {
        return this.productsService.approveReview(id, false);
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, public_decorator_js_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all active categories' }),
    (0, common_1.Get)('api/categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "getCategories", null);
__decorate([
    (0, public_decorator_js_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Serve category image' }),
    (0, common_1.Get)('api/categories/:id/image'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "serveCategoryImage", null);
__decorate([
    (0, public_decorator_js_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'List active products (Filter/Search/Sort)' }),
    (0, common_1.Get)('api/products'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)('category')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('sort')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_js_1.PaginationDto, String, String, String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "getProducts", null);
__decorate([
    (0, public_decorator_js_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get active product by URL Slug' }),
    (0, common_1.Get)('api/products/:slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "getProductBySlug", null);
__decorate([
    (0, public_decorator_js_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Serve raw product image (BYTEA)' }),
    (0, common_1.Get)('api/products/:productId/image/:imageId'),
    __param(0, (0, common_1.Param)('imageId')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "serveProductImage", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Submit a product review' }),
    (0, common_1.Post)('api/reviews'),
    __param(0, (0, current_user_decorator_js_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_review_dto_js_1.CreateReviewDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "createReview", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user wishlist' }),
    (0, common_1.Get)('api/wishlist'),
    __param(0, (0, current_user_decorator_js_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "getWishlist", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add product to user wishlist' }),
    (0, common_1.Post)('api/wishlist/:productId'),
    __param(0, (0, current_user_decorator_js_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "addToWishlist", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Remove product from wishlist' }),
    (0, common_1.Delete)('api/wishlist/:productId'),
    __param(0, (0, current_user_decorator_js_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "removeFromWishlist", null);
__decorate([
    (0, public_decorator_js_1.Public)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Retrieve cart contents' }),
    (0, common_1.Get)('api/cart'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getCart", null);
__decorate([
    (0, public_decorator_js_1.Public)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Add item to shopping cart' }),
    (0, common_1.Post)('api/cart/items'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, add_cart_item_dto_js_1.AddCartItemDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "addToCart", null);
__decorate([
    (0, public_decorator_js_1.Public)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Update cart item quantity' }),
    (0, common_1.Patch)('api/cart/items/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('quantity')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "updateCartItem", null);
__decorate([
    (0, public_decorator_js_1.Public)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Remove item from cart' }),
    (0, common_1.Delete)('api/cart/items/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "removeCartItem", null);
__decorate([
    (0, public_decorator_js_1.Public)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Clear cart' }),
    (0, common_1.Delete)('api/cart'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "clearCart", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin', 'manager'),
    (0, swagger_1.ApiOperation)({ summary: 'List all products (including inactive, Admin)' }),
    (0, common_1.Get)('api/admin/products'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)('category')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_js_1.PaginationDto, String, String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "adminGetProducts", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin', 'manager'),
    (0, swagger_1.ApiOperation)({ summary: 'Get product detail by ID (Admin)' }),
    (0, common_1.Get)('api/admin/products/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "adminGetProduct", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Create new catalog product (Admin)' }),
    (0, common_1.Post)('api/admin/products'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_product_dto_js_1.CreateProductDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "adminCreateProduct", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Modify product details (Admin)' }),
    (0, common_1.Patch)('api/admin/products/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_dto_js_1.UpdateProductDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "adminUpdateProduct", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Soft delete product from catalog (Admin)' }),
    (0, common_1.Delete)('api/admin/products/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "adminDeleteProduct", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload product hero thumbnail (Admin)' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.Post)('api/admin/products/:id/images'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "adminUploadPrimaryImage", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload lifestyle gallery image (Admin)' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.Post)('api/admin/products/:id/gallery'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)('caption')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "adminUploadGalleryImage", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete product image (Admin)' }),
    (0, common_1.Delete)('api/admin/products/images/:imgId'),
    __param(0, (0, common_1.Param)('imgId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "adminDeleteImage", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Create product category (Admin)' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.Post)('api/admin/categories'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_category_dto_js_1.CreateCategoryDto, Object]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "adminCreateCategory", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Update product category details (Admin)' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.Patch)('api/admin/categories/:id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_category_dto_js_1.UpdateCategoryDto, Object]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "adminUpdateCategory", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove product category (Admin)' }),
    (0, common_1.Delete)('api/admin/categories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "adminDeleteCategory", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Add product variant (size, weight etc., Admin)' }),
    (0, common_1.Post)('api/admin/products/:id/variants'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_variant_dto_js_1.CreateVariantDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "adminAddVariant", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Update product variant (Admin)' }),
    (0, common_1.Patch)('api/admin/products/variants/:vid'),
    __param(0, (0, common_1.Param)('vid')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_variant_dto_js_1.UpdateVariantDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "adminUpdateVariant", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove variant (Admin)' }),
    (0, common_1.Delete)('api/admin/products/variants/:vid'),
    __param(0, (0, common_1.Param)('vid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "adminDeleteVariant", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin', 'manager'),
    (0, swagger_1.ApiOperation)({ summary: 'List full variant stock levels (Admin)' }),
    (0, common_1.Get)('api/admin/inventory'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "adminGetInventory", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin', 'manager'),
    (0, swagger_1.ApiOperation)({ summary: 'Set variant inventory quantity (Admin)' }),
    (0, common_1.Patch)('api/admin/inventory/:variantId'),
    __param(0, (0, common_1.Param)('variantId')),
    __param(1, (0, common_1.Body)('quantity')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "adminUpdateInventory", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin', 'manager'),
    (0, swagger_1.ApiOperation)({ summary: 'List customer reviews for queue audit (Admin)' }),
    (0, common_1.Get)('api/admin/reviews'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Query)('approved')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_js_1.PaginationDto, Boolean]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "adminGetReviews", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve a review (Admin)' }),
    (0, common_1.Patch)('api/admin/reviews/:id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "adminApproveReview", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_js_1.JwtAuthGuard, roles_guard_js_1.RolesGuard),
    (0, roles_decorator_js_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Reject/Disapprove review (Admin)' }),
    (0, common_1.Patch)('api/admin/reviews/:id/reject'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "adminRejectReview", null);
exports.ProductsController = ProductsController = __decorate([
    (0, swagger_1.ApiTags)('Products & Catalog'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [products_service_js_1.ProductsService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map