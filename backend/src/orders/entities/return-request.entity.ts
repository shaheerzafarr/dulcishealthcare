import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity.js';
import { User } from '../../users/entities/user.entity.js';

@Entity('return_requests')
export class ReturnRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_id' })
  orderId: string;

  @ManyToOne(() => Order, (order) => order.returnRequests, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ length: 30, default: 'requested' })
  status: string; // requested, approved, item_received, refund_processing, refunded, rejected, cancelled

  @Column({ length: 50 })
  reason: string; // 'damaged', 'wrong_item', 'not_as_described', 'changed_mind'

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'bytea', name: 'image_data', nullable: true })
  imageData: Buffer;

  @Column({ name: 'image_mime', length: 50, nullable: true })
  imageMime: string;

  @Column({ name: 'admin_notes', type: 'text', nullable: true })
  adminNotes: string;

  @Column({ name: 'resolved_at', type: 'timestamptz', nullable: true })
  resolvedAt: Date;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}
