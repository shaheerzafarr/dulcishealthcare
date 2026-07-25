import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('tax_rules')
export class TaxRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string; // 'Pakistan GST', 'Punjab Sales Tax'

  @Column({ length: 10, default: 'PK' })
  country: string;

  @Column({ length: 50, nullable: true })
  state: string;

  @Column({ type: 'decimal', precision: 5, scale: 4 })
  rate: number; // 0.1700 = 17%

  @Column({ name: 'applies_to', length: 30, default: 'all' })
  appliesTo: string; // 'all', 'skincare', 'haircare'

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
}
