import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Product } from './product.entity.js';

@Entity('related_products')
@Unique(['productId', 'relatedId', 'relationType'])
export class RelatedProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'product_id' })
  productId: string;

  @ManyToOne(() => Product, (product) => product.relatedProducts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'related_id' })
  relatedId: string;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'related_id' })
  related: Product;

  @Column({ name: 'relation_type', length: 30, default: 'related' })
  relationType: string; // 'related', 'frequently_bought', 'upsell'

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;
}
