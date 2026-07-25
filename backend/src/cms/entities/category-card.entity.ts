import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from '../../products/entities/category.entity.js';

@Entity('category_cards')
export class CategoryCard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'category_id' })
  categoryId: string;

  @ManyToOne(() => Category, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ name: 'display_name', length: 100 })
  displayName: string;

  @Column({ name: 'item_count_label', length: 50, nullable: true })
  itemCountLabel: string; // e.g. '12 Items'

  @Column({ name: 'bg_color', length: 20, nullable: true })
  bgColor: string;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
