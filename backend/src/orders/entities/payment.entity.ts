import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Order } from './order.entity.js';
import { Transaction } from './transaction.entity.js';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_id' })
  orderId: string;

  @ManyToOne(() => Order, (order) => order.payments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ length: 50 })
  method: string; // 'cod', 'card', 'jazzcash', 'easypaisa', 'bank_transfer'

  @Column({ length: 30, default: 'pending' })
  status: string; // pending, completed, failed, refunded

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ length: 10, default: 'PKR' })
  currency: string;

  @Column({ name: 'gateway_ref', length: 255, nullable: true })
  gatewayRef: string;

  @Column({ type: 'jsonb', name: 'gateway_response', nullable: true })
  gatewayResponse: any;

  @Column({ name: 'paid_at', type: 'timestamptz', nullable: true })
  paidAt: Date;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Transaction, (txn) => txn.payment)
  transactions: Transaction[];
}
