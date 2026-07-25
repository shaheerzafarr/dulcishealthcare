import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Page } from './page.entity.js';

@Entity('page_sections')
export class PageSection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'page_id' })
  pageId: string;

  @ManyToOne(() => Page, (page) => page.sections, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'page_id' })
  page: Page;

  @Column({ length: 50 })
  type: string; // 'hero', 'text', 'image_text', 'grid', 'cta'

  @Column({ type: 'jsonb', default: '{}' })
  content: any; // section data (headers, body text, button links etc)

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;
}
