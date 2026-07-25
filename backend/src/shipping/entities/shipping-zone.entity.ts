import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { ShippingRate } from './shipping-rate.entity.js';

@Entity('shipping_zones')
export class ShippingZone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string; // 'Lahore Metro', 'Punjab', 'Sindh', 'All Pakistan'

  @Column({ type: 'text', array: true, default: '{}' })
  countries: string[]; // ['PK']

  @Column({ type: 'text', array: true, nullable: true })
  states: string[];

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => ShippingRate, (rate) => rate.zone)
  rates: ShippingRate[];
}
