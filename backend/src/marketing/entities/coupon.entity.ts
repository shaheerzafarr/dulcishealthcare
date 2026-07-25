import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { CouponUsage } from './coupon-usage.entity.js';

@Entity('coupons')
export class Coupon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  code: string; // 'SUMMER30', 'WELCOME10'

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'discount_type', length: 20 })
  discountType: string; // 'percentage', 'fixed'

  @Column({ name: 'discount_value', type: 'decimal', precision: 10, scale: 2 })
  discountValue: number;

  @Column({ name: 'min_order_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  minOrderAmount: number;

  @Column({ name: 'max_discount', type: 'decimal', precision: 10, scale: 2, nullable: true })
  maxDiscount: number; // cap for percentage discount

  @Column({ name: 'usage_limit', type: 'int', nullable: true })
  usageLimit: number; // total uses allowed

  @Column({ name: 'usage_per_user', type: 'int', default: 1 })
  usagePerUser: number; // uses per customer

  @Column({ name: 'times_used', type: 'int', default: 0 })
  timesUsed: number;

  @Column({ name: 'applicable_categories', type: 'uuid', array: true, default: '{}' })
  applicableCategories: string[];

  @Column({ name: 'applicable_products', type: 'uuid', array: true, default: '{}' })
  applicableProducts: string[];

  @Column({ name: 'starts_at', type: 'timestamptz', nullable: true })
  startsAt: Date;

  @Column({ name: 'expires_at', type: 'timestamptz', nullable: true })
  expiresAt: Date;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => CouponUsage, (usage) => usage.coupon)
  usages: CouponUsage[];
}
