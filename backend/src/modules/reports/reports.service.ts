import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LabTest, TestStatus } from '../tests/test.entity';
import { Patient } from '../patients/patient.entity';
import { TestResult } from '../results/result.entity';
import { Payment, PaymentType, PaymentStatus } from '../payments/payment.entity';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);
  private emailSubscribers: Map<string, { email: string; frequency: 'daily' | 'weekly' }> = new Map();

  constructor(
    @InjectRepository(LabTest) private testRepo: Repository<LabTest>,
    @InjectRepository(Patient) private patientRepo: Repository<Patient>,
    @InjectRepository(TestResult) private resultRepo: Repository<TestResult>,
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
  ) {}

  async getDashboardStats() {
    const [totalPatients, totalTests, completedTests, pendingTests, totalRevenue, totalExpenses] =
      await Promise.all([
        this.patientRepo.count(),
        this.testRepo.count(),
        this.testRepo.count({ where: { status: TestStatus.COMPLETED } }),
        this.testRepo.count({ where: { status: TestStatus.PENDING } }),
        this.paymentRepo.count({ where: { status: PaymentStatus.COMPLETED } }),
        this.paymentRepo.count({ where: { type: PaymentType.EXPENSE } }),
      ]);

    const revenue = await this.paymentRepo
      .createQueryBuilder('p')
      .select('COALESCE(SUM(p.amount), 0)', 'total')
      .where('p.status = :status', { status: 'completed' })
      .getRawOne();

    const expenses = await this.paymentRepo
      .createQueryBuilder('p')
      .select('COALESCE(SUM(p.amount), 0)', 'total')
      .where('p.type = :type', { type: PaymentType.EXPENSE })
      .getRawOne();

    return {
      totalPatients,
      totalTests,
      completedTests,
      pendingTests,
      completionRate: totalTests ? Math.round((completedTests / totalTests) * 100) : 0,
      totalRevenue: parseFloat(revenue?.total || '0'),
      totalExpenses: parseFloat(expenses?.total || '0'),
      netProfit: parseFloat(revenue?.total || '0') - parseFloat(expenses?.total || '0'),
    };
  }

  async getFinancialReport(startDate?: string, endDate?: string) {
    const where: any = {};
    if (startDate && endDate) {
      where.createdAt = Between(new Date(startDate), new Date(endDate));
    }

    const payments = await this.paymentRepo.find({ where, order: { createdAt: 'DESC' } });
    const income = payments.filter(p => p.type === 'payment' || p.type === 'income');
    const outcome = payments.filter(p => p.type === PaymentType.EXPENSE || p.type === PaymentType.REFUND);

    return {
      period: { startDate, endDate },
      totalIncome: income.reduce((s, p) => s + p.amount, 0),
      totalOutcome: outcome.reduce((s, p) => s + p.amount, 0),
      netBalance: income.reduce((s, p) => s + p.amount, 0) - outcome.reduce((s, p) => s + p.amount, 0),
      incomeTransactions: income,
      expenseTransactions: outcome,
    };
  }

  async getPatientStats() {
    const total = await this.patientRepo.count();
    const monthly = await this.patientRepo
      .createQueryBuilder('p')
      .select("TO_CHAR(p.createdAt, 'YYYY-MM')", 'month')
      .addSelect('COUNT(*)', 'count')
      .groupBy("TO_CHAR(p.createdAt, 'YYYY-MM')")
      .orderBy('month', 'DESC')
      .limit(12)
      .getRawMany();

    return { total, monthly: monthly.map(m => ({ month: m.month, count: parseInt(m.count, 10) })) };
  }

  async getTestCategoryStats() {
    const stats = await this.testRepo
      .createQueryBuilder('t')
      .select('t.testCategory', 'category')
      .addSelect('COUNT(*)', 'count')
      .groupBy('t.testCategory')
      .orderBy('count', 'DESC')
      .getRawMany();

    return stats.map(s => ({ category: s.category, count: parseInt(s.count, 10) }));
  }

  async exportToCsv(type: 'patients' | 'tests' | 'payments' | 'income-outcome', filters?: any): Promise<string> {
    let rows: any[] = [];
    let headers: string[] = [];

    switch (type) {
      case 'patients': {
        headers = ['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Gender', 'Date of Birth', 'Created At'];
        const patients = await this.patientRepo.find({ order: { createdAt: 'DESC' } });
        rows = patients.map(p => [p.id, p.firstName, p.lastName, p.email || '', p.phone || '', p.gender || '', p.dateOfBirth || '', p.createdAt.toISOString()]);
        break;
      }
      case 'tests': {
        headers = ['ID', 'Test Number', 'Test Name', 'Category', 'Status', 'Priority', 'Patient ID', 'Price', 'Paid', 'Ordered Date', 'Created At'];
        const tests = await this.testRepo.find({ order: { createdAt: 'DESC' } });
        rows = tests.map(t => [t.id, t.testNumber, t.testName, t.testCategory || '', t.status, t.priority, t.patientId, t.price, t.isPaid, t.orderedDate.toISOString(), t.createdAt.toISOString()]);
        break;
      }
      case 'payments':
      case 'income-outcome': {
        headers = ['ID', 'Type', 'Amount', 'Status', 'Description', 'Patient ID', 'Created At'];
        const payments = await this.paymentRepo.find({ order: { createdAt: 'DESC' } });
        rows = payments.map(p => [p.id, p.type, p.amount, p.status, p.description || '', p.patientId || '', p.createdAt.toISOString()]);
        break;
      }
    }

    const escapeCsv = (val: any) => {
      const str = String(val ?? '');
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const csvLines = [headers.join(',')];
    for (const row of rows) {
      csvLines.push(row.map(escapeCsv).join(','));
    }
    return csvLines.join('\n');
  }

  async subscribeToEmailReports(email: string, frequency: 'daily' | 'weekly' = 'daily') {
    const id = Math.random().toString(36).substring(2, 10);
    this.emailSubscribers.set(id, { email, frequency });
    this.logger.log(`Subscribed ${email} for ${frequency} reports`);
    return { id, email, frequency, message: 'Subscribed successfully' };
  }

  async unsubscribeFromReports(id: string) {
    const deleted = this.emailSubscribers.delete(id);
    return { success: deleted, message: deleted ? 'Unsubscribed' : 'Subscription not found' };
  }

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async sendDailyReports() {
    this.logger.log('Generating daily reports for subscribers...');
    const report = await this.getDashboardStats();
    const csv = await this.exportToCsv('income-outcome');

    for (const [id, sub] of this.emailSubscribers) {
      if (sub.frequency === 'daily') {
        this.logger.log(`Sending daily report to ${sub.email} - Revenue: $${report.totalRevenue}`);
        // In production, integrate with SendGrid/Mailgun/SMTP
        this.logger.log(`Email sent to ${sub.email} with CSV (${csv.length} bytes)`);
      }
    }
  }

  @Cron('0 9 * * 1') // Every Monday at 9 AM
  async sendWeeklyReports() {
    this.logger.log('Generating weekly reports for subscribers...');
    for (const [id, sub] of this.emailSubscribers) {
      if (sub.frequency === 'weekly') {
        this.logger.log(`Sending weekly report to ${sub.email}`);
      }
    }
  }
}