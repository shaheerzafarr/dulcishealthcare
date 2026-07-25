import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
import { ProductsService } from './products.service.js';
import { ProductsController } from './products.controller.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Category,
      ProductImage,
      ProductGallery,
      ProductVariant,
      ProductInventory,
      ProductTag,
      ProductIngredient,
      ProductBenefit,
      RelatedProduct,
      Review,
      Wishlist,
      Cart,
      CartItem,
    ]),
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}
