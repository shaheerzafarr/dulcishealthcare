import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity.js';

@Entity('product_gallery')
export class ProductGallery {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'product_id' })
  productId: string;

  @ManyToOne(() => Product, (product) => product.gallery, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'bytea', name: 'image_data' })
  imageData: Buffer;

  @Column({ name: 'mime_type', length: 50 })
  mimeType: string;

  @Column({ length: 255, nullable: true })
  filename: string;

  @Column({ length: 255, nullable: true })
  caption: string;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
}
