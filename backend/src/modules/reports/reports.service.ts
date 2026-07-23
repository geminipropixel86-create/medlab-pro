import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LabTest } from '../tests/test.entity';
import { Patient } from '../patients/patient.entity';
import { Payment } from '../payments/payment.entity';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(
    @InjectRepository(LabTest) private testRepo: Repository<LabTest>,
    @InjectRepository(Patient) private patientRepo: Repository<Patient>,
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
  ) {}

  async getDashboardStats() {
    const [totalTests, totalPatients, totalRevenue, testsToday] = await Promise.all([
      this.testRepo.count(),
      this.patientRepo.count({ where: { isActive: true } }),
      this.paymentRepo
        .createQueryBuilder('p')
        .select('COALESCE(SUM(p.totalAmount), 0)', 'sum')
        .where('p.status = :status', { status: 'completed' })
        .getRawOne(),
      this.testRepo
        .createQueryBuilder('t')
        .where('t.createdAt::date = CURRENT_DATE')
        .getCount(),
    ]);

    const monthlyTrend = await this.testRepo
      .createQueryBuilder('t')
      .select("DATE_TRUNC('month', t.createdAt)", 'month')
      .addSelect('COUNT(*)', 'tests')
      .groupBy('month')
      .orderBy('month', 'DESC')
      .limit(6)
      .getRawMany();

    return {
      totalTests,
      totalPatients,
      totalRevenue: Number(totalRevenue?.sum || 0),
      testsToday,
      monthlyTrend,
    };
  }
}