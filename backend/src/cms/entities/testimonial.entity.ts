import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('testimonials')
export class Testimonial {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'customer_name', length: 100 })
  customerName: string;

  @Column({ length: 100, nullable: true })
  role: string; // e.g. 'Verified Buyer', 'Skincare Blogger'

  @Column({ type: 'text' })
  quote: string;

  @Column({ type: 'smallint', default: 5 })
  rating: number;

  @Column({ type: 'bytea', name: 'avatar_data', nullable: true })
  avatarData: Buffer;

  @Column({ name: 'avatar_mime', length: 50, nullable: true })
  avatarMime: string;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
}
