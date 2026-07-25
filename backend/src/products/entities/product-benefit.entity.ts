import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity.js';

@Entity('product_benefits')
export class ProductBenefit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'product_id' })
  productId: string;

  @ManyToOne(() => Product, (product) => product.benefits, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ length: 255 })
  benefit: string; // 'Minimizes appearance of enlarged pores'

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;
}
