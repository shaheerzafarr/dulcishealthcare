import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { UtmTracking } from './utm-tracking.entity.js';
import { PixelEvent } from './pixel-event.entity.js';

@Entity('visitor_sessions')
export class VisitorSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'session_id', length: 255 })
  sessionId: string; // Cookie session tracking

  @Column({ name: 'ip_address', length: 45, nullable: true })
  ipAddress: string;

  @Column({ name: 'user_agent', type: 'text', nullable: true })
  userAgent: string;

  @Column({ type: 'text', nullable: true })
  referrer: string;

  @Column({ name: 'landing_page', length: 500, nullable: true })
  landingPage: string;

  @Column({ name: 'device_type', length: 20, nullable: true })
  deviceType: string; // 'mobile', 'desktop', 'tablet'

  @Column({ length: 100, nullable: true })
  country: string;

  @Column({ length: 100, nullable: true })
  city: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'started_at' })
  startedAt: Date;

  @Column({ name: 'ended_at', type: 'timestamptz', nullable: true })
  endedAt: Date;

  @OneToMany(() => UtmTracking, (utm) => utm.session)
  utmTracking: UtmTracking[];

  @OneToMany(() => PixelEvent, (event) => event.session)
  pixelEvents: PixelEvent[];
}
