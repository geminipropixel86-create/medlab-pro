import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { PriceItem } from '../pricing/price-item.entity';

export enum PackageStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DISCONTINUED = 'discontinued',
}

@Entity('test_packages')
export class TestPackage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  name: string;

  @Column({ length: 100, nullable: true })
  nameAr: string;

  @Column({ length: 100, nullable: true })
  nameCkb: string;

  @Column({ length: 100, nullable: true })
  nameKmr: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('text', { nullable: true })
  descriptionAr: string;

  @Column('text', { nullable: true })
  descriptionCkb: string;

  @Column('text', { nullable: true })
  descriptionKmr: string;

  @Column({ type: 'jsonb', nullable: true })
  includedTests: { testId: string; testName: string; testNameAr: string; testNameCkb: string; testNameKmr: string; originalPrice: number }[];

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  packagePrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  originalTotalPrice: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  savingsPercentage: number;

  @Column({ type: 'jsonb', nullable: true })
  highlights: string[];

  @Column({ type: 'jsonb', nullable: true })
  highlightsAr: string[];

  @Column({ type: 'jsonb', nullable: true })
  highlightsCkb: string[];

  @Column({ type: 'jsonb', nullable: true })
  highlightsKmr: string[];

  @Column({ length: 200, nullable: true })
  badge: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}