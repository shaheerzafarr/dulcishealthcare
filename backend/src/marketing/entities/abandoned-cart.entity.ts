import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { Order } from '../../orders/entities/order.entity.js';

@Entity('abandoned_carts')
export class AbandonedCart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ length: 255, nullable: true })
  email: string;

  @Column({ type: 'jsonb', name: 'cart_data' })
  cartData: any; // snapshot of cart items

  @Column({ name: 'cart_total', type: 'decimal', precision: 10, scale: 2, nullable: true })
  cartTotal: number;

  @Column({ name: 'recovery_email_sent', default: false })
  recoveryEmailSent: boolean;

  @Column({ name: 'recovery_email_sent_at', type: 'timestamptz', nullable: true })
  recoveryEmailSentAt: Date;

  @Column({ default: false })
  recovered: boolean;

  @Column({ name: 'recovered_order_id', nullable: true })
  recoveredOrderId: string;

  @ManyToOne(() => Order, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'recovered_order_id' })
  recoveredOrder: Order;

  @Column({ name: 'abandoned_at', type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  abandonedAt: Date;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
}
