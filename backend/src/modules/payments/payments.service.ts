import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from './payment.entity';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,
  ) {}

  async create(dto: Partial<Payment>): Promise<Payment> {
    const count = await this.paymentRepo.count();
    const payment = this.paymentRepo.create({
      ...dto,
      invoiceNumber: `INV-${String(count + 1).padStart(6, '0')}`,
      totalAmount: Number(dto.amount) + Number(dto.tax || 0) - Number(dto.discount || 0),
    });
    return this.paymentRepo.save(payment);
  }

  async findAll(query: { page?: number; limit?: number; status?: string; patientId?: string }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.patientId) where.patientId = query.patientId;

    const [data, total] = await this.paymentRepo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['patient'],
    });
    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getRevenueStats() {
    const result = await this.paymentRepo
      .createQueryBuilder('p')
      .select("DATE_TRUNC('month', p.createdAt)", 'month')
      .addSelect('SUM(p.totalAmount)', 'revenue')
      .addSelect('COUNT(*)', 'transactions')
      .where('p.status = :status', { status: PaymentStatus.COMPLETED })
      .groupBy('month')
      .orderBy('month', 'DESC')
      .limit(12)
      .getRawMany();
    return result;
  }

  async getSummary() {
    const [totalRevenue, pendingAmount, totalTransactions] = await Promise.all([
      this.paymentRepo
        .createQueryBuilder('p')
        .select('COALESCE(SUM(p.totalAmount), 0)', 'sum')
        .where('p.status = :status', { status: PaymentStatus.COMPLETED })
        .getRawOne(),
      this.paymentRepo
        .createQueryBuilder('p')
        .select('COALESCE(SUM(p.totalAmount), 0)', 'sum')
        .where('p.status = :status', { status: PaymentStatus.PENDING })
        .getRawOne(),
      this.paymentRepo.count({ where: { status: PaymentStatus.COMPLETED } }),
    ]);
    return {
      totalRevenue: totalRevenue?.sum || 0,
      pendingAmount: pendingAmount?.sum || 0,
      totalTransactions,
    };
  }
}