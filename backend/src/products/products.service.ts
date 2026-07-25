import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { Product } from './entities/product.entity.js';
import { Category } from './entities/category.entity.js';
import { ProductImage } from './entities/product-image.entity.js';
import { ProductGallery } from './entities/product-gallery.entity.js';
import { ProductVariant } from './entities/product-variant.entity.js';
import { ProductInventory } from './entities/product-inventory.entity.js';
import { ProductTag } from './entities/product-tag.entity.js';
import { ProductIngredient } from './entities/product-ingredient.entity.js';
import { ProductBenefit } from './entities/product-benefit.entity.js';
import { RelatedProduct } from './entities/related-product.entity.js';
import { Review } from './entities/review.entity.js';
import { Wishlist } from './entities/wishlist.entity.js';
import { Cart } from './entities/cart.entity.js';
import { CartItem } from './entities/cart-item.entity.js';

import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { CreateVariantDto } from './dto/create-variant.dto.js';
import { UpdateVariantDto } from './dto/update-variant.dto.js';
import { CreateReviewDto } from './dto/create-review.dto.js';
import { AddCartItemDto } from './dto/add-cart-item.dto.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';
import { generateSlug } from '../common/utils/slugify.js';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
    @InjectRepository(ProductImage) private imageRepo: Repository<ProductImage>,
    @InjectRepository(ProductGallery) private galleryRepo: Repository<ProductGallery>,
    @InjectRepository(ProductVariant) private variantRepo: Repository<ProductVariant>,
    @InjectRepository(ProductInventory) private inventoryRepo: Repository<ProductInventory>,
    @InjectRepository(ProductTag) private tagRepo: Repository<ProductTag>,
    @InjectRepository(ProductIngredient) private ingredientRepo: Repository<ProductIngredient>,
    @InjectRepository(ProductBenefit) private benefitRepo: Repository<ProductBenefit>,
    @InjectRepository(RelatedProduct) private relatedRepo: Repository<RelatedProduct>,
    @InjectRepository(Review) private reviewRepo: Repository<Review>,
    @InjectRepository(Wishlist) private wishlistRepo: Repository<Wishlist>,
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
    @InjectRepository(CartItem) private cartItemRepo: Repository<CartItem>,
  ) {}

  // ==========================================
  // CATEGORIES
  // ==========================================

  async findAllCategories(includeInactive = false): Promise<Category[]> {
    return this.categoryRepo.find({
      where: includeInactive ? {} : { isActive: true },
      order: { sortOrder: 'ASC' },
    });
  }

  async findCategoryById(id: string): Promise<Category> {
    const cat = await this.categoryRepo.findOne({ where: { id } });
    if (!cat) throw new NotFoundException('Category not found');
    return cat;
  }

  async createCategory(dto: CreateCategoryDto, file?: Express.Multer.File): Promise<Category> {
    const slug = generateSlug(dto.name);
    const existing = await this.categoryRepo.findOne({ where: { slug } });
    if (existing) throw new ConflictException('Category slug already exists');

    const cat = this.categoryRepo.create({
      ...dto,
      slug,
      imageData: file?.buffer || undefined,
      imageMime: file?.mimetype || undefined,
    });
    return this.categoryRepo.save(cat);
  }

  async updateCategory(id: string, dto: UpdateCategoryDto, file?: Express.Multer.File): Promise<Category> {
    const cat = await this.findCategoryById(id);
    if (dto.name && dto.name !== cat.name) {
      const slug = generateSlug(dto.name);
      const existing = await this.categoryRepo.findOne({ where: { slug } });
      if (existing && existing.id !== id) throw new ConflictException('Category slug already exists');
      cat.slug = slug;
    }
    Object.assign(cat, dto);
    if (file) {
      cat.imageData = file.buffer;
      cat.imageMime = file.mimetype;
    }
    return this.categoryRepo.save(cat);
  }

  async deleteCategory(id: string): Promise<void> {
    const cat = await this.findCategoryById(id);
    await this.categoryRepo.remove(cat);
  }

  // ==========================================
  // PRODUCTS
  // ==========================================

  async findAllProducts(
    paginationDto: PaginationDto,
    categorySlug?: string,
    search?: string,
    sort?: string,
    includeInactive = false,
  ) {
    const page = paginationDto.page || 1;
    const limit = paginationDto.limit || 10;
    const skip = (page - 1) * limit;

    const query = this.productRepo.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.images', 'images', 'images.isPrimary = true')
      .leftJoinAndSelect('product.variants', 'variants');

    if (!includeInactive) {
      query.andWhere('product.isActive = :isActive', { isActive: true });
    }

    if (categorySlug) {
      query.andWhere('category.slug = :categorySlug', { categorySlug });
    }

    if (search) {
      query.andWhere(
        '(product.name ILIKE :search OR product.sku ILIKE :search OR product.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (sort) {
      const [field, direction] = sort.split(':');
      if (field === 'price') {
        query.orderBy('product.basePrice', direction?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC');
      } else {
        query.orderBy('product.createdAt', 'DESC');
      }
    } else {
      query.orderBy('product.createdAt', 'DESC');
    }

    query.take(limit).skip(skip);

    const [products, total] = await query.getManyAndCount();

    // Strip image binary data for product listings to optimize bandwidth
    const processedProducts = products.map(p => {
      if (p.images) {
        p.images = p.images.map(img => {
          delete (img as any).imageData;
          return img;
        });
      }
      return p;
    });

    return {
      products: processedProducts,
      total,
      page,
      limit,
    };
  }

  async findProductById(id: string): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: {
        category: true,
        images: true,
        gallery: true,
        variants: { inventory: true },
        tags: true,
        ingredients: true,
        benefits: true,
        relatedProducts: { related: true },
      },
    });
    if (!product) throw new NotFoundException('Product not found');
    
    // Clean binary data
    if (product.images) product.images.forEach(img => delete (img as any).imageData);
    if (product.gallery) product.gallery.forEach(img => delete (img as any).imageData);
    
    return product;
  }

  async findProductBySlug(slug: string): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { slug, isActive: true },
      relations: {
        category: true,
        images: true,
        gallery: true,
        variants: { inventory: true },
        tags: true,
        ingredients: true,
        benefits: true,
        relatedProducts: { related: true },
      },
    });
    if (!product) throw new NotFoundException('Product not found');
    
    // Clean binary data
    if (product.images) product.images.forEach(img => delete (img as any).imageData);
    if (product.gallery) product.gallery.forEach(img => delete (img as any).imageData);
    
    return product;
  }

  async createProduct(dto: CreateProductDto): Promise<Product> {
    const slug = generateSlug(dto.name);
    const existing = await this.productRepo.findOne({ where: { slug } });
    if (existing) throw new ConflictException('Product slug already exists');

    const { tags: tagsInput, ingredients: ingredientsInput, benefits: benefitsInput, ...productDetails } = dto;

    const product = this.productRepo.create({
      ...productDetails,
      slug,
    });

    const savedProduct = await this.productRepo.save(product);

    if (tagsInput && tagsInput.length > 0) {
      const tags = tagsInput.map(t => this.tagRepo.create({ productId: savedProduct.id, tag: t }));
      await this.tagRepo.save(tags);
    }

    if (ingredientsInput && ingredientsInput.length > 0) {
      const ing = ingredientsInput.map((name, i) => this.ingredientRepo.create({ productId: savedProduct.id, name, sortOrder: i }));
      await this.ingredientRepo.save(ing);
    }

    if (benefitsInput && benefitsInput.length > 0) {
      const ben = benefitsInput.map((benefit, i) => this.benefitRepo.create({ productId: savedProduct.id, benefit, sortOrder: i }));
      await this.benefitRepo.save(ben);
    }

    return this.findProductById(savedProduct.id);
  }

  async updateProduct(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findProductById(id);

    if (dto.name && dto.name !== product.name) {
      const slug = generateSlug(dto.name);
      const existing = await this.productRepo.findOne({ where: { slug } });
      if (existing && existing.id !== id) throw new ConflictException('Product slug already exists');
      product.slug = slug;
    }

    Object.assign(product, dto);
    await this.productRepo.save(product);

    if (dto.tags !== undefined) {
      await this.tagRepo.delete({ productId: id });
      if (dto.tags.length > 0) {
        const tags = dto.tags.map(t => this.tagRepo.create({ productId: id, tag: t }));
        await this.tagRepo.save(tags);
      }
    }

    if (dto.ingredients !== undefined) {
      await this.ingredientRepo.delete({ productId: id });
      if (dto.ingredients.length > 0) {
        const ing = dto.ingredients.map((name, i) => this.ingredientRepo.create({ productId: id, name, sortOrder: i }));
        await this.ingredientRepo.save(ing);
      }
    }

    if (dto.benefits !== undefined) {
      await this.benefitRepo.delete({ productId: id });
      if (dto.benefits.length > 0) {
        const ben = dto.benefits.map((benefit, i) => this.benefitRepo.create({ productId: id, benefit, sortOrder: i }));
        await this.benefitRepo.save(ben);
      }
    }

    return this.findProductById(id);
  }

  async softDeleteProduct(id: string): Promise<void> {
    await this.productRepo.update(id, { isActive: false });
  }

  // ==========================================
  // IMAGE AND FILE SERVICES
  // ==========================================

  async uploadProductImage(productId: string, file: Express.Multer.File, isPrimary: boolean): Promise<ProductImage> {
    if (isPrimary) {
      // Unset other primary flags
      await this.imageRepo.update({ productId, isPrimary: true }, { isPrimary: false });
    }

    const img = this.imageRepo.create({
      productId,
      imageData: file.buffer,
      mimeType: file.mimetype,
      filename: file.originalname,
      isPrimary,
    });
    return this.imageRepo.save(img);
  }

  async uploadProductGallery(productId: string, file: Express.Multer.File, caption?: string): Promise<ProductGallery> {
    const gallery = this.galleryRepo.create({
      productId,
      imageData: file.buffer,
      mimeType: file.mimetype,
      filename: file.originalname,
      caption,
    });
    return this.galleryRepo.save(gallery);
  }

  async deleteProductImage(imageId: string): Promise<void> {
    const img = await this.imageRepo.findOne({ where: { id: imageId } });
    if (!img) throw new NotFoundException('Image not found');
    await this.imageRepo.remove(img);
  }

  async getProductImageRaw(imageId: string): Promise<{ data: Buffer; mime: string }> {
    const img = await this.imageRepo.findOne({ where: { id: imageId } });
    if (!img) throw new NotFoundException('Image not found');
    return { data: img.imageData, mime: img.mimeType };
  }

  async getCategoryRaw(categoryId: string): Promise<{ data: Buffer; mime: string }> {
    const cat = await this.categoryRepo.findOne({ where: { id: categoryId } });
    if (!cat || !cat.imageData) throw new NotFoundException('Category image not found');
    return { data: cat.imageData, mime: cat.imageMime };
  }

  // ==========================================
  // VARIANTS & INVENTORY
  // ==========================================

  async addVariant(productId: string, dto: CreateVariantDto): Promise<ProductVariant> {
    const variant = this.variantRepo.create({
      ...dto,
      productId,
    });
    const savedVariant = await this.variantRepo.save(variant);

    const inv = this.inventoryRepo.create({
      variantId: savedVariant.id,
      quantity: dto.quantity || 0,
      reserved: 0,
    });
    await this.inventoryRepo.save(inv);

    return this.variantRepo.findOne({ where: { id: savedVariant.id }, relations: { inventory: true } }) as any;
  }

  async updateVariant(variantId: string, dto: UpdateVariantDto): Promise<ProductVariant> {
    const variant = await this.variantRepo.findOne({ where: { id: variantId } });
    if (!variant) throw new NotFoundException('Variant not found');
    Object.assign(variant, dto);
    return this.variantRepo.save(variant);
  }

  async deleteVariant(variantId: string): Promise<void> {
    const variant = await this.variantRepo.findOne({ where: { id: variantId } });
    if (!variant) throw new NotFoundException('Variant not found');
    await this.variantRepo.remove(variant);
  }

  async getFullInventory() {
    return this.inventoryRepo.find({
      relations: { variant: { product: true } },
    });
  }

  async updateInventory(variantId: string, quantity: number) {
    const inv = await this.inventoryRepo.findOne({ where: { variantId } });
    if (!inv) throw new NotFoundException('Inventory record not found');
    inv.quantity = quantity;
    return this.inventoryRepo.save(inv);
  }

  // ==========================================
  // REVIEWS & MODERATION
  // ==========================================

  async createReview(userId: string, dto: CreateReviewDto): Promise<Review> {
    // Prevent duplicate reviews
    const existing = await this.reviewRepo.findOne({
      where: { productId: dto.productId, userId, orderId: dto.orderId || undefined },
    });
    if (existing) throw new BadRequestException('You have already reviewed this purchase');

    const review = this.reviewRepo.create({
      ...dto,
      userId,
      isApproved: false, // Moderated by default
      isVerified: !!dto.orderId,
    });
    return this.reviewRepo.save(review);
  }

  async approveReview(id: string, isApproved: boolean): Promise<Review> {
    const review = await this.reviewRepo.findOne({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');
    review.isApproved = isApproved;
    return this.reviewRepo.save(review);
  }

  async findAllReviews(paginationDto: PaginationDto, isApproved?: boolean) {
    const page = paginationDto.page || 1;
    const limit = paginationDto.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (isApproved !== undefined) where.isApproved = isApproved;

    const [reviews, total] = await this.reviewRepo.findAndCount({
      where,
      relations: { product: true, user: true },
      order: { createdAt: 'DESC' },
      take: limit,
      skip,
    });

    return {
      reviews,
      total,
      page,
      limit,
    };
  }

  // ==========================================
  // WISHLIST
  // ==========================================

  async getWishlist(userId: string): Promise<Wishlist[]> {
    return this.wishlistRepo.find({
      where: { userId },
      relations: { product: { images: true } },
    });
  }

  async addToWishlist(userId: string, productId: string): Promise<Wishlist> {
    const existing = await this.wishlistRepo.findOne({ where: { userId, productId } });
    if (existing) return existing;

    const wish = this.wishlistRepo.create({ userId, productId });
    return this.wishlistRepo.save(wish);
  }

  async removeFromWishlist(userId: string, productId: string): Promise<void> {
    await this.wishlistRepo.delete({ userId, productId });
  }

  // ==========================================
  // CART SERVICES
  // ==========================================

  async getCart(userId?: string, sessionId?: string): Promise<Cart> {
    if (!userId && !sessionId) {
      throw new BadRequestException('Must provide either userId or guest sessionId to retrieve cart');
    }

    const where = userId ? { userId } : { sessionId };
    let cart = await this.cartRepo.findOne({
      where,
      relations: { items: { product: { images: true }, variant: true } },
    });

    if (!cart) {
      cart = this.cartRepo.create(where);
      await this.cartRepo.save(cart);
      cart.items = [];
    }

    return cart;
  }

  async addToCart(userId: string | undefined, sessionId: string | undefined, dto: AddCartItemDto): Promise<CartItem> {
    const cart = await this.getCart(userId, sessionId);

    let item = await this.cartItemRepo.findOne({
      where: { cartId: cart.id, productId: dto.productId, variantId: dto.variantId || undefined },
    });

    if (item) {
      item.quantity += dto.quantity || 1;
    } else {
      item = this.cartItemRepo.create({
        cartId: cart.id,
        productId: dto.productId,
        variantId: dto.variantId || undefined,
        quantity: dto.quantity || 1,
      });
    }

    return this.cartItemRepo.save(item);
  }

  async updateCartItem(itemId: string, quantity: number): Promise<CartItem> {
    const item = await this.cartItemRepo.findOne({ where: { id: itemId } });
    if (!item) throw new NotFoundException('Cart item not found');
    item.quantity = quantity;
    return this.cartItemRepo.save(item);
  }

  async removeCartItem(itemId: string): Promise<void> {
    await this.cartItemRepo.delete(itemId);
  }

  async clearCart(userId?: string, sessionId?: string): Promise<void> {
    const cart = await this.getCart(userId, sessionId);
    await this.cartItemRepo.delete({ cartId: cart.id });
  }
}
