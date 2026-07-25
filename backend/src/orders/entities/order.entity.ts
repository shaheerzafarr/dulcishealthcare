import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { ShippingRate } from '../../shipping/entities/shipping-rate.entity.js';
import { OrderItem } from './order-item.entity.js';
import { OrderStatusHistory } from './order-status-history.entity.js';
import { Payment } from './payment.entity.js';
import { Invoice } from './invoice.entity.js';
import { ReturnRequest } from './return-request.entity.js';
import { Refund } from './refund.entity.js';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'order_number', unique: true, length: 30 })
  orderNumber: string; // 'DLC-20260725-0001'

  @Column({ length: 30, default: 'pending' })
  status: string; // pending, confirmed, processing, packed, shipped, out_for_delivery, delivered, cancelled, returned

  // Shipping Address Snapshot
  @Column({ name: 'shipping_name', length: 200 })
  shippingName: string;

  @Column({ name: 'shipping_phone', length: 30, nullable: true })
  shippingPhone: string;

  @Column({ name: 'shipping_line1', length: 255 })
  shippingLine1: string;

  @Column({ name: 'shipping_line2', length: 255, nullable: true })
  shippingLine2: string;

  @Column({ name: 'shipping_city', length: 100 })
  shippingCity: string;

  @Column({ name: 'shipping_state', length: 100, nullable: true })
  shippingState: string;

  @Column({ name: 'shipping_postal', length: 20 })
  shippingPostal: string;

  @Column({ name: 'shipping_country', length: 100, default: 'Pakistan' })
  shippingCountry: string;

  // Billing Address Snapshot
  @Column({ name: 'billing_name', length: 200, nullable: true })
  billingName: string;

  @Column({ name: 'billing_line1', length: 255, nullable: true })
  billingLine1: string;

  @Column({ name: 'billing_city', length: 100, nullable: true })
  billingCity: string;

  @Column({ name: 'billing_state', length: 100, nullable: true })
  billingState: string;

  @Column({ name: 'billing_postal', length: 20, nullable: true })
  billingPostal: string;

  @Column({ name: 'billing_country', length: 100, nullable: true })
  billingCountry: string;

  @Column({ name: 'billing_same_as_shipping', default: true })
  billingSameAsShipping: boolean;

  // Totals
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  subtotal: number;

  @Column({ name: 'shipping_cost', type: 'decimal', precision: 10, scale: 2, default: 0 })
  shippingCost: number;

  @Column({ name: 'tax_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  taxAmount: number;

  @Column({ name: 'discount_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  discountAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  total: number;

  // References
  @Column({ name: 'coupon_id', type: 'uuid', nullable: true })
  couponId: string; // validated and tracked separately

  @Column({ name: 'shipping_rate_id', nullable: true })
  shippingRateId: string;

  @ManyToOne(() => ShippingRate, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'shipping_rate_id' })
  shippingRate: ShippingRate;

  // Courier/Tracking
  @Column({ name: 'tracking_number', length: 100, nullable: true })
  trackingNumber: string;

  @Column({ name: 'courier_name', length: 100, nullable: true })
  courierName: string;

  @Column({ name: 'estimated_delivery', type: 'date', nullable: true })
  estimatedDelivery: Date;

  @Column({ name: 'delivered_at', type: 'timestamptz', nullable: true })
  deliveredAt: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'admin_notes', type: 'text', nullable: true })
  adminNotes: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[];

  @OneToMany(() => OrderStatusHistory, (history) => history.order)
  statusHistory: OrderStatusHistory[];

  @OneToMany(() => Payment, (payment) => payment.order)
  payments: Payment[];

  @OneToMany(() => Invoice, (invoice) => invoice.order)
  invoices: Invoice[];

  @OneToMany(() => ReturnRequest, (ret) => ret.order)
  returnRequests: ReturnRequest[];

  @OneToMany(() => Refund, (ref) => ref.order)
  refunds: Refund[];
}
