import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ShippingZone } from './shipping-zone.entity.js';

@Entity('shipping_rates')
export class ShippingRate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'zone_id' })
  zoneId: string;

  @ManyToOne(() => ShippingZone, (zone) => zone.rates, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'zone_id' })
  zone: ShippingZone;

  @Column({ length: 100 })
  name: string; // 'Standard Delivery', 'Express', 'Free Shipping'

  @Column({ name: 'min_order_amount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  minOrderAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  rate: number;

  @Column({ name: 'rate_per_kg', type: 'decimal', precision: 10, scale: 2, default: 0 })
  ratePerKg: number;

  @Column({ name: 'estimated_days_min', default: 1 })
  estimatedDaysMin: number;

  @Column({ name: 'estimated_days_max', default: 5 })
  estimatedDaysMax: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
}
