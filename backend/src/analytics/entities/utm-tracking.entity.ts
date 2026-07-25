import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { VisitorSession } from './visitor-session.entity.js';

@Entity('utm_tracking')
export class UtmTracking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'session_id' })
  sessionId: string;

  @ManyToOne(() => VisitorSession, (session) => session.utmTracking, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'session_id' })
  session: VisitorSession;

  @Column({ name: 'utm_source', length: 100, nullable: true })
  utmSource: string; // 'facebook', 'google'

  @Column({ name: 'utm_medium', length: 100, nullable: true })
  utmMedium: string; // 'cpc', 'email'

  @Column({ name: 'utm_campaign', length: 255, nullable: true })
  utmCampaign: string;

  @Column({ name: 'utm_term', length: 255, nullable: true })
  utmTerm: string;

  @Column({ name: 'utm_content', length: 255, nullable: true })
  utmContent: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
}
