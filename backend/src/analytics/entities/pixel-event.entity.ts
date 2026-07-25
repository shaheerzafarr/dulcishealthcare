import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { VisitorSession } from './visitor-session.entity.js';
import { User } from '../../users/entities/user.entity.js';

@Entity('pixel_events')
export class PixelEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'session_id', nullable: true })
  sessionId: string;

  @ManyToOne(() => VisitorSession, (session) => session.pixelEvents, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'session_id' })
  session: VisitorSession;

  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'event_name', length: 100 })
  eventName: string; // 'PageView', 'ViewContent', 'AddToCart', 'Purchase'

  @Column({ length: 30 })
  platform: string; // 'meta', 'ga4', 'tiktok'

  @Column({ type: 'jsonb', name: 'event_data', nullable: true })
  eventData: any; // payload details (items, subtotal, curreny etc)

  @Column({ name: 'sent_to_gateway', default: false })
  sentToGateway: boolean; // flag showing if server-side CAPI/GA4 measurement protocol was dispatched

  @Column({ type: 'jsonb', name: 'gateway_response', nullable: true })
  gatewayResponse: any;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
}
