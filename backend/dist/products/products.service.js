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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_js_1 = require("./entities/product.entity.js");
const category_entity_js_1 = require("./entities/category.entity.js");
const product_image_entity_js_1 = require("./entities/product-image.entity.js");
const product_gallery_entity_js_1 = require("./entities/product-gallery.entity.js");
const product_variant_entity_js_1 = require("./entities/product-variant.entity.js");
const product_inventory_entity_js_1 = require("./entities/product-inventory.entity.js");
const product_tag_entity_js_1 = require("./entities/product-tag.entity.js");
const product_ingredient_entity_js_1 = require("./entities/product-ingredient.entity.js");
const product_benefit_entity_js_1 = require("./entities/product-benefit.entity.js");
const related_product_entity_js_1 = require("./entities/related-product.entity.js");
const review_entity_js_1 = require("./entities/review.entity.js");
const wishlist_entity_js_1 = require("./entities/wishlist.entity.js");
const cart_entity_js_1 = require("./entities/cart.entity.js");
const cart_item_entity_js_1 = require("./entities/cart-item.entity.js");
const slugify_js_1 = require("../common/utils/slugify.js");
let ProductsService = class ProductsService {
    productRepo;
    categoryRepo;
    imageRepo;
    galleryRepo;
    variantRepo;
    inventoryRepo;
    tagRepo;
    ingredientRepo;
    benefitRepo;
    relatedRepo;
    reviewRepo;
    wishlistRepo;
    cartRepo;
    cartItemRepo;
    constructor(productRepo, categoryRepo, imageRepo, galleryRepo, variantRepo, inventoryRepo, tagRepo, ingredientRepo, benefitRepo, relatedRepo, reviewRepo, wishlistRepo, cartRepo, cartItemRepo) {
        this.productRepo = productRepo;
        this.categoryRepo = categoryRepo;
        this.imageRepo = imageRepo;
        this.galleryRepo = galleryRepo;
        this.variantRepo = variantRepo;
        this.inventoryRepo = inventoryRepo;
        this.tagRepo = tagRepo;
        this.ingredientRepo = ingredientRepo;
        this.benefitRepo = benefitRepo;
        this.relatedRepo = relatedRepo;
        this.reviewRepo = reviewRepo;
        this.wishlistRepo = wishlistRepo;
        this.cartRepo = cartRepo;
        this.cartItemRepo = cartItemRepo;
    }
    async findAllCategories(includeInactive = false) {
        return this.categoryRepo.find({
            where: includeInactive ? {} : { isActive: true },
            order: { sortOrder: 'ASC' },
        });
    }
    async findCategoryById(id) {
        const cat = await this.categoryRepo.findOne({ where: { id } });
        if (!cat)
            throw new common_1.NotFoundException('Category not found');
        return cat;
    }
    async createCategory(dto, file) {
        const slug = (0, slugify_js_1.generateSlug)(dto.name);
        const existing = await this.categoryRepo.findOne({ where: { slug } });
        if (existing)
            throw new common_1.ConflictException('Category slug already exists');
        const cat = this.categoryRepo.create({
            ...dto,
            slug,
            imageData: file?.buffer || undefined,
            imageMime: file?.mimetype || undefined,
        });
        return this.categoryRepo.save(cat);
    }
    async updateCategory(id, dto, file) {
        const cat = await this.findCategoryById(id);
        if (dto.name && dto.name !== cat.name) {
            const slug = (0, slugify_js_1.generateSlug)(dto.name);
            const existing = await this.categoryRepo.findOne({ where: { slug } });
            if (existing && existing.id !== id)
                throw new common_1.ConflictException('Category slug already exists');
            cat.slug = slug;
        }
        Object.assign(cat, dto);
        if (file) {
            cat.imageData = file.buffer;
            cat.imageMime = file.mimetype;
        }
        return this.categoryRepo.save(cat);
    }
    async deleteCategory(id) {
        const cat = await this.findCategoryById(id);
        await this.categoryRepo.remove(cat);
    }
    async findAllProducts(paginationDto, categorySlug, search, sort, includeInactive = false) {
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
            query.andWhere('(product.name ILIKE :search OR product.sku ILIKE :search OR product.description ILIKE :search)', { search: `%${search}%` });
        }
        if (sort) {
            const [field, direction] = sort.split(':');
            if (field === 'price') {
                query.orderBy('product.basePrice', direction?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC');
            }
            else {
                query.orderBy('product.createdAt', 'DESC');
            }
        }
        else {
            query.orderBy('product.createdAt', 'DESC');
        }
        query.take(limit).skip(skip);
        const [products, total] = await query.getManyAndCount();
        const processedProducts = products.map(p => {
            if (p.images) {
                p.images = p.images.map(img => {
                    delete img.imageData;
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
    async findProductById(id) {
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
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        if (product.images)
            product.images.forEach(img => delete img.imageData);
        if (product.gallery)
            product.gallery.forEach(img => delete img.imageData);
        return product;
    }
    async findProductBySlug(slug) {
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
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        if (product.images)
            product.images.forEach(img => delete img.imageData);
        if (product.gallery)
            product.gallery.forEach(img => delete img.imageData);
        return product;
    }
    async createProduct(dto) {
        const slug = (0, slugify_js_1.generateSlug)(dto.name);
        const existing = await this.productRepo.findOne({ where: { slug } });
        if (existing)
            throw new common_1.ConflictException('Product slug already exists');
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
    async updateProduct(id, dto) {
        const product = await this.findProductById(id);
        if (dto.name && dto.name !== product.name) {
            const slug = (0, slugify_js_1.generateSlug)(dto.name);
            const existing = await this.productRepo.findOne({ where: { slug } });
            if (existing && existing.id !== id)
                throw new common_1.ConflictException('Product slug already exists');
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
    async softDeleteProduct(id) {
        await this.productRepo.update(id, { isActive: false });
    }
    async uploadProductImage(productId, file, isPrimary) {
        if (isPrimary) {
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
    async uploadProductGallery(productId, file, caption) {
        const gallery = this.galleryRepo.create({
            productId,
            imageData: file.buffer,
            mimeType: file.mimetype,
            filename: file.originalname,
            caption,
        });
        return this.galleryRepo.save(gallery);
    }
    async deleteProductImage(imageId) {
        const img = await this.imageRepo.findOne({ where: { id: imageId } });
        if (!img)
            throw new common_1.NotFoundException('Image not found');
        await this.imageRepo.remove(img);
    }
    async getProductImageRaw(imageId) {
        const img = await this.imageRepo.findOne({ where: { id: imageId } });
        if (!img)
            throw new common_1.NotFoundException('Image not found');
        return { data: img.imageData, mime: img.mimeType };
    }
    async getCategoryRaw(categoryId) {
        const cat = await this.categoryRepo.findOne({ where: { id: categoryId } });
        if (!cat || !cat.imageData)
            throw new common_1.NotFoundException('Category image not found');
        return { data: cat.imageData, mime: cat.imageMime };
    }
    async addVariant(productId, dto) {
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
        return this.variantRepo.findOne({ where: { id: savedVariant.id }, relations: { inventory: true } });
    }
    async updateVariant(variantId, dto) {
        const variant = await this.variantRepo.findOne({ where: { id: variantId } });
        if (!variant)
            throw new common_1.NotFoundException('Variant not found');
        Object.assign(variant, dto);
        return this.variantRepo.save(variant);
    }
    async deleteVariant(variantId) {
        const variant = await this.variantRepo.findOne({ where: { id: variantId } });
        if (!variant)
            throw new common_1.NotFoundException('Variant not found');
        await this.variantRepo.remove(variant);
    }
    async getFullInventory() {
        return this.inventoryRepo.find({
            relations: { variant: { product: true } },
        });
    }
    async updateInventory(variantId, quantity) {
        const inv = await this.inventoryRepo.findOne({ where: { variantId } });
        if (!inv)
            throw new common_1.NotFoundException('Inventory record not found');
        inv.quantity = quantity;
        return this.inventoryRepo.save(inv);
    }
    async createReview(userId, dto) {
        const existing = await this.reviewRepo.findOne({
            where: { productId: dto.productId, userId, orderId: dto.orderId || undefined },
        });
        if (existing)
            throw new common_1.BadRequestException('You have already reviewed this purchase');
        const review = this.reviewRepo.create({
            ...dto,
            userId,
            isApproved: false,
            isVerified: !!dto.orderId,
        });
        return this.reviewRepo.save(review);
    }
    async approveReview(id, isApproved) {
        const review = await this.reviewRepo.findOne({ where: { id } });
        if (!review)
            throw new common_1.NotFoundException('Review not found');
        review.isApproved = isApproved;
        return this.reviewRepo.save(review);
    }
    async findAllReviews(paginationDto, isApproved) {
        const page = paginationDto.page || 1;
        const limit = paginationDto.limit || 10;
        const skip = (page - 1) * limit;
        const where = {};
        if (isApproved !== undefined)
            where.isApproved = isApproved;
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
    async getWishlist(userId) {
        return this.wishlistRepo.find({
            where: { userId },
            relations: { product: { images: true } },
        });
    }
    async addToWishlist(userId, productId) {
        const existing = await this.wishlistRepo.findOne({ where: { userId, productId } });
        if (existing)
            return existing;
        const wish = this.wishlistRepo.create({ userId, productId });
        return this.wishlistRepo.save(wish);
    }
    async removeFromWishlist(userId, productId) {
        await this.wishlistRepo.delete({ userId, productId });
    }
    async getCart(userId, sessionId) {
        if (!userId && !sessionId) {
            throw new common_1.BadRequestException('Must provide either userId or guest sessionId to retrieve cart');
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
    async addToCart(userId, sessionId, dto) {
        const cart = await this.getCart(userId, sessionId);
        let item = await this.cartItemRepo.findOne({
            where: { cartId: cart.id, productId: dto.productId, variantId: dto.variantId || undefined },
        });
        if (item) {
            item.quantity += dto.quantity || 1;
        }
        else {
            item = this.cartItemRepo.create({
                cartId: cart.id,
                productId: dto.productId,
                variantId: dto.variantId || undefined,
                quantity: dto.quantity || 1,
            });
        }
        return this.cartItemRepo.save(item);
    }
    async updateCartItem(itemId, quantity) {
        const item = await this.cartItemRepo.findOne({ where: { id: itemId } });
        if (!item)
            throw new common_1.NotFoundException('Cart item not found');
        item.quantity = quantity;
        return this.cartItemRepo.save(item);
    }
    async removeCartItem(itemId) {
        await this.cartItemRepo.delete(itemId);
    }
    async clearCart(userId, sessionId) {
        const cart = await this.getCart(userId, sessionId);
        await this.cartItemRepo.delete({ cartId: cart.id });
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_js_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_js_1.Category)),
    __param(2, (0, typeorm_1.InjectRepository)(product_image_entity_js_1.ProductImage)),
    __param(3, (0, typeorm_1.InjectRepository)(product_gallery_entity_js_1.ProductGallery)),
    __param(4, (0, typeorm_1.InjectRepository)(product_variant_entity_js_1.ProductVariant)),
    __param(5, (0, typeorm_1.InjectRepository)(product_inventory_entity_js_1.ProductInventory)),
    __param(6, (0, typeorm_1.InjectRepository)(product_tag_entity_js_1.ProductTag)),
    __param(7, (0, typeorm_1.InjectRepository)(product_ingredient_entity_js_1.ProductIngredient)),
    __param(8, (0, typeorm_1.InjectRepository)(product_benefit_entity_js_1.ProductBenefit)),
    __param(9, (0, typeorm_1.InjectRepository)(related_product_entity_js_1.RelatedProduct)),
    __param(10, (0, typeorm_1.InjectRepository)(review_entity_js_1.Review)),
    __param(11, (0, typeorm_1.InjectRepository)(wishlist_entity_js_1.Wishlist)),
    __param(12, (0, typeorm_1.InjectRepository)(cart_entity_js_1.Cart)),
    __param(13, (0, typeorm_1.InjectRepository)(cart_item_entity_js_1.CartItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map