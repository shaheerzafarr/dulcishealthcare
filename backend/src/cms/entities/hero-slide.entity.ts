import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('hero_slides')
export class HeroSlide {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255, nullable: true })
  title: string;

  @Column({ length: 255, nullable: true })
  tagline: string;

  @Column({ name: 'button_text', length: 50, nullable: true })
  buttonText: string;

  @Column({ name: 'button_link', length: 255, nullable: true })
  buttonLink: string;

  @Column({ type: 'bytea', name: 'image_data' })
  imageData: Buffer;

  @Column({ name: 'image_mime', length: 50 })
  imageMime: string;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
}
