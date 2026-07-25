import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('footer')
export class Footer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'section_name', length: 100 })
  sectionName: string; // 'about', 'quick_links', 'contact'

  @Column({ type: 'jsonb', default: '{}' })
  content: any; // links, social handles etc.

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}
