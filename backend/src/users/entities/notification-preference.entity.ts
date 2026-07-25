import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity.js';

@Entity('notification_preferences')
export class NotificationPreference {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', unique: true })
  userId: string;

  @OneToOne(() => User, (user) => user.notificationPreference, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'email_orders', default: true })
  emailOrders: boolean;

  @Column({ name: 'email_promos', default: true })
  emailPromos: boolean;

  @Column({ name: 'sms_orders', default: false })
  smsOrders: boolean;

  @Column({ name: 'sms_promos', default: false })
  smsPromos: boolean;

  @Column({ name: 'push_enabled', default: false })
  pushEnabled: boolean;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}
