import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('announcements')
export class Announcement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  message: string; // 'Get Free Shipping on all orders above PKR 3000!'

  @Column({ length: 255, nullable: true })
  link: string;

  @Column({ name: 'bg_color', length: 20, default: '#000000' })
  bgColor: string;

  @Column({ name: 'text_color', length: 20, default: '#FFFFFF' })
  textColor: string;

  @Column({ name: 'starts_at', type: 'timestamptz', nullable: true })
  startsAt: Date;

  @Column({ name: 'ends_at', type: 'timestamptz', nullable: true })
  endsAt: Date;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
}
