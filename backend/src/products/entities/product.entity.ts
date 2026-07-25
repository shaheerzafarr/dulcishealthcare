import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Category } from './category.entity.js';
import { ProductImage } from './product-image.entity.js';
import { ProductGallery } from './product-gallery.entity.js';
import { ProductVariant } from './product-variant.entity.js';
import { ProductTag } from './product-tag.entity.js';
import { ProductIngredient } from './product-ingredient.entity.js';
import { ProductBenefit } from './product-benefit.entity.js';
import { Review } from './review.entity.js';
import { Wishlist } from './wishlist.entity.js';
import { RelatedProduct } from './related-product.entity.js';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'category_id', nullable: true })
  categoryId: string;

  @ManyToOne(() => Category, (category) => category.products, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ length: 255 })
  name: string;

  @Column({ unique: true, length: 280 })
  slug: string;

  @Column({ length: 100, unique: true, nullable: true })
  sku: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  details: string;

  @Column({ name: 'base_price', type: 'decimal', precision: 10, scale: 2 })
  basePrice: number;

  @Column({ name: 'compare_price', type: 'decimal', precision: 10, scale: 2, nullable: true })
  comparePrice: number;

  @Column({ name: 'cost_price', type: 'decimal', precision: 10, scale: 2, nullable: true })
  costPrice: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'is_featured', default: false })
  isFeatured: boolean;

  @Column({ name: 'meta_title', length: 255, nullable: true })
  metaTitle: string;

  @Column({ name: 'meta_description', type: 'text', nullable: true })
  metaDescription: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => ProductImage, (image) => image.product)
  images: ProductImage[];

  @OneToMany(() => ProductGallery, (gallery) => gallery.product)
  gallery: ProductGallery[];

  @OneToMany(() => ProductVariant, (variant) => variant.product)
  variants: ProductVariant[];

  @OneToMany(() => ProductTag, (tag) => tag.product)
  tags: ProductTag[];

  @OneToMany(() => ProductIngredient, (ing) => ing.product)
  ingredients: ProductIngredient[];

  @OneToMany(() => ProductBenefit, (benefit) => benefit.product)
  benefits: ProductBenefit[];

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.product)
  wishlists: Wishlist[];

  @OneToMany(() => RelatedProduct, (related) => related.product)
  relatedProducts: RelatedProduct[];
}
