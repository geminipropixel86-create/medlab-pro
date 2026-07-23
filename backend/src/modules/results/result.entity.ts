import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { LabTest } from '../tests/test.entity';
import { User } from '../auth/user.entity';

@Entity('test_results')
export class TestResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => LabTest)
  @JoinColumn({ name: 'testId' })
  test: LabTest;

  @Column()
  testId: string;

  @Column({ type: 'jsonb' })
  parameters: Array<{
    name: string;
    value: string;
    unit: string;
    referenceRange: string;
    flag: 'normal' | 'high' | 'low';
    remarks?: string;
  }>;

  @Column('text', { nullable: true })
  summary: string;

  @Column('text', { nullable: true })
  interpretation: string;

  @Column({ nullable: true })
  pdfUrl: string;

  @Column({ default: false })
  isPatientNotified: boolean;

  @Column({ nullable: true })
  verifiedById: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'verifiedById' })
  verifiedBy: User;

  @Column({ nullable: true })
  verifiedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}