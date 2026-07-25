import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

@Entity('navigation')
export class Navigation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'parent_id', nullable: true })
  parentId: string;

  @ManyToOne(() => Navigation, (nav) => nav.children, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: Navigation;

  @OneToMany(() => Navigation, (nav) => nav.parent)
  children: Navigation[];

  @Column({ length: 100 })
  label: string;

  @Column({ length: 255 })
  link: string;

  @Column({ length: 30, default: 'header' })
  location: string; // 'header', 'footer', 'mobile'

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;
}
