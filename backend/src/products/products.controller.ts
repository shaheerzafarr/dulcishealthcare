import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, UseInterceptors, UploadedFile, Res, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response, Request } from 'express';
import { ProductsService } from './products.service.js';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { Public } from '../common/decorators/public.decorator.js';

import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { CreateVariantDto } from './dto/create-variant.dto.js';
import { UpdateVariantDto } from './dto/update-variant.dto.js';
import { CreateReviewDto } from './dto/create-review.dto.js';
import { AddCartItemDto } from './dto/add-cart-item.dto.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';

@ApiTags('Products & Catalog')
@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ==========================================
  // PUBLIC STOREFRONT ROUTES
  // ==========================================

  @Public()
  @ApiOperation({ summary: 'List all active categories' })
  @Get('api/categories')
  getCategories() {
    return this.productsService.findAllCategories(false);
  }

  @Public()
  @ApiOperation({ summary: 'Serve category image' })
  @Get('api/categories/:id/image')
  async serveCategoryImage(@Param('id') id: string, @Res() res: Response) {
    const file = await this.productsService.getCategoryRaw(id);
    res.setHeader('Content-Type', file.mime);
    return res.send(file.data);
  }

  @Public()
  @ApiOperation({ summary: 'List active products (Filter/Search/Sort)' })
  @Get('api/products')
  getProducts(
    @Query() paginationDto: PaginationDto,
    @Query('category') categorySlug?: string,
    @Query('search') search?: string,
    @Query('sort') sort?: string,
  ) {
    return this.productsService.findAllProducts(paginationDto, categorySlug, search, sort, false);
  }

  @Public()
  @ApiOperation({ summary: 'Get active product by URL Slug' })
  @Get('api/products/:slug')
  getProductBySlug(@Param('slug') slug: string) {
    return this.productsService.findProductBySlug(slug);
  }

  @Public()
  @ApiOperation({ summary: 'Serve raw product image (BYTEA)' })
  @Get('api/products/:productId/image/:imageId')
  async serveProductImage(@Param('imageId') imageId: string, @Res() res: Response) {
    const file = await this.productsService.getProductImageRaw(imageId);
    res.setHeader('Content-Type', file.mime);
    return res.send(file.data);
  }

  // ==========================================
  // CUSTOMER / USER AUTHENTICATED ROUTES
  // ==========================================

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit a product review' })
  @Post('api/reviews')
  createReview(@CurrentUser() user: any, @Body() dto: CreateReviewDto) {
    return this.productsService.createReview(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user wishlist' })
  @Get('api/wishlist')
  getWishlist(@CurrentUser() user: any) {
    return this.productsService.getWishlist(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add product to user wishlist' })
  @Post('api/wishlist/:productId')
  addToWishlist(@CurrentUser() user: any, @Param('productId') productId: string) {
    return this.productsService.addToWishlist(user.id, productId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove product from wishlist' })
  @Delete('api/wishlist/:productId')
  removeFromWishlist(@CurrentUser() user: any, @Param('productId') productId: string) {
    return this.productsService.removeFromWishlist(user.id, productId);
  }

  // ==========================================
  // SERVER SIDE CART ROUTES (Saves state, supports guests)
  // ==========================================

  @Public() // Accessible for guests (uses sessionId) or authenticated users
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Retrieve cart contents' })
  @Get('api/cart')
  async getCart(@Req() req: Request) {
    const user = (req as any).user;
    const sessionId = req.query.sessionId as string;
    return this.productsService.getCart(user?.id, sessionId);
  }

  @Public()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add item to shopping cart' })
  @Post('api/cart/items')
  async addToCart(@Req() req: Request, @Body() dto: AddCartItemDto) {
    const user = (req as any).user;
    const sessionId = req.query.sessionId as string;
    return this.productsService.addToCart(user?.id, sessionId, dto);
  }

  @Public()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update cart item quantity' })
  @Patch('api/cart/items/:id')
  async updateCartItem(@Param('id') itemId: string, @Body('quantity') quantity: number) {
    return this.productsService.updateCartItem(itemId, quantity);
  }

  @Public()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Remove item from cart' })
  @Delete('api/cart/items/:id')
  async removeCartItem(@Param('id') itemId: string) {
    return this.productsService.removeCartItem(itemId);
  }

  @Public()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Clear cart' })
  @Delete('api/cart')
  async clearCart(@Req() req: Request) {
    const user = (req as any).user;
    const sessionId = req.query.sessionId as string;
    return this.productsService.clearCart(user?.id, sessionId);
  }

  // ==========================================
  // ADMINISTRATIVE CONFIGURATION ROUTES
  // ==========================================

  // --- Products ---
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'List all products (including inactive, Admin)' })
  @Get('api/admin/products')
  adminGetProducts(
    @Query() paginationDto: PaginationDto,
    @Query('category') categorySlug?: string,
    @Query('search') search?: string,
  ) {
    return this.productsService.findAllProducts(paginationDto, categorySlug, search, undefined, true);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Get product detail by ID (Admin)' })
  @Get('api/admin/products/:id')
  adminGetProduct(@Param('id') id: string) {
    return this.productsService.findProductById(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create new catalog product (Admin)' })
  @Post('api/admin/products')
  adminCreateProduct(@Body() dto: CreateProductDto) {
    return this.productsService.createProduct(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Modify product details (Admin)' })
  @Patch('api/admin/products/:id')
  adminUpdateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.updateProduct(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Soft delete product from catalog (Admin)' })
  @Delete('api/admin/products/:id')
  adminDeleteProduct(@Param('id') id: string) {
    return this.productsService.softDeleteProduct(id);
  }

  // --- Uploads ---
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Upload product hero thumbnail (Admin)' })
  @ApiConsumes('multipart/form-data')
  @Post('api/admin/products/:id/images')
  @UseInterceptors(FileInterceptor('image'))
  adminUploadPrimaryImage(
    @Param('id') productId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.productsService.uploadProductImage(productId, file, true);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Upload lifestyle gallery image (Admin)' })
  @ApiConsumes('multipart/form-data')
  @Post('api/admin/products/:id/gallery')
  @UseInterceptors(FileInterceptor('image'))
  adminUploadGalleryImage(
    @Param('id') productId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('caption') caption?: string,
  ) {
    return this.productsService.uploadProductGallery(productId, file, caption);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete product image (Admin)' })
  @Delete('api/admin/products/images/:imgId')
  adminDeleteImage(@Param('imgId') imageId: string) {
    return this.productsService.deleteProductImage(imageId);
  }

  // --- Categories ---
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create product category (Admin)' })
  @ApiConsumes('multipart/form-data')
  @Post('api/admin/categories')
  @UseInterceptors(FileInterceptor('image'))
  adminCreateCategory(
    @Body() dto: CreateCategoryDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.productsService.createCategory(dto, file);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update product category details (Admin)' })
  @ApiConsumes('multipart/form-data')
  @Patch('api/admin/categories/:id')
  @UseInterceptors(FileInterceptor('image'))
  adminUpdateCategory(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.productsService.updateCategory(id, dto, file);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Remove product category (Admin)' })
  @Delete('api/admin/categories/:id')
  adminDeleteCategory(@Param('id') id: string) {
    return this.productsService.deleteCategory(id);
  }

  // --- Variants & Inventory ---
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Add product variant (size, weight etc., Admin)' })
  @Post('api/admin/products/:id/variants')
  adminAddVariant(@Param('id') productId: string, @Body() dto: CreateVariantDto) {
    return this.productsService.addVariant(productId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update product variant (Admin)' })
  @Patch('api/admin/products/variants/:vid')
  adminUpdateVariant(@Param('vid') variantId: string, @Body() dto: UpdateVariantDto) {
    return this.productsService.updateVariant(variantId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Remove variant (Admin)' })
  @Delete('api/admin/products/variants/:vid')
  adminDeleteVariant(@Param('vid') variantId: string) {
    return this.productsService.deleteVariant(variantId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'List full variant stock levels (Admin)' })
  @Get('api/admin/inventory')
  adminGetInventory() {
    return this.productsService.getFullInventory();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Set variant inventory quantity (Admin)' })
  @Patch('api/admin/inventory/:variantId')
  adminUpdateInventory(@Param('variantId') variantId: string, @Body('quantity') quantity: number) {
    return this.productsService.updateInventory(variantId, quantity);
  }

  // --- Reviews Moderation ---
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'List customer reviews for queue audit (Admin)' })
  @Get('api/admin/reviews')
  adminGetReviews(
    @Query() paginationDto: PaginationDto,
    @Query('approved') isApproved?: boolean,
  ) {
    return this.productsService.findAllReviews(paginationDto, isApproved);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Approve a review (Admin)' })
  @Patch('api/admin/reviews/:id/approve')
  adminApproveReview(@Param('id') id: string) {
    return this.productsService.approveReview(id, true);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Reject/Disapprove review (Admin)' })
  @Patch('api/admin/reviews/:id/reject')
  adminRejectReview(@Param('id') id: string) {
    return this.productsService.approveReview(id, false);
  }
}
