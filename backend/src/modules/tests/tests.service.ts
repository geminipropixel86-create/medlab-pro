import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { LabTest, TestStatus } from './test.entity';

@Injectable()
export class TestsService {
  private readonly logger = new Logger(TestsService.name);

  constructor(
    @InjectRepository(LabTest)
    private testRepo: Repository<LabTest>,
  ) {}

  async create(dto: Partial<LabTest>, userId: string): Promise<LabTest> {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const count = await this.testRepo.count();
    const test = this.testRepo.create({
      ...dto,
      testNumber: `T-${dateStr}-${String(count + 1).padStart(4, '0')}`,
      orderedDate: new Date(),
      createdById: userId,
      status: TestStatus.PENDING,
    });
    return this.testRepo.save(test);
  }

  async findAll(query: {
    page?: number; limit?: number; status?: string;
    patientId?: string; from?: string; to?: string;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const where: any = {};

    if (query.status) where.status = query.status;
    if (query.patientId) where.patientId = query.patientId;
    if (query.from && query.to) {
      where.orderedDate = Between(new Date(query.from), new Date(query.to));
    }

    const [data, total] = await this.testRepo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['patient', 'assignedTo', 'createdBy'],
    });

    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string): Promise<LabTest> {
    const test = await this.testRepo.findOne({
      where: { id },
      relations: ['patient', 'assignedTo', 'createdBy'],
    });
    if (!test) throw new NotFoundException('Test not found');
    return test;
  }

  async update(id: string, dto: Partial<LabTest>): Promise<LabTest> {
    const test = await this.findOne(id);
    Object.assign(test, dto);
    return this.testRepo.save(test);
  }

  async updateStatus(id: string, status: TestStatus, userId?: string) {
    const test = await this.findOne(id);
    test.status = status;
    if (status === TestStatus.SAMPLE_COLLECTED) {
      test.sampleCollectedDate = new Date();
    }
    if (status === TestStatus.COMPLETED) {
      test.resultDate = new Date();
    }
    if (userId) test.assignedToId = userId;
    return this.testRepo.save(test);
  }

  async getStats() {
    const [total, pending, inProgress, completed, cancelled] = await Promise.all([
      this.testRepo.count(),
      this.testRepo.count({ where: { status: TestStatus.PENDING } }),
      this.testRepo.count({ where: { status: TestStatus.IN_PROGRESS } }),
      this.testRepo.count({ where: { status: TestStatus.COMPLETED } }),
      this.testRepo.count({ where: { status: TestStatus.CANCELLED } }),
    ]);
    return {
      total, pending, inProgress, completed, cancelled,
      completionRate: total ? Math.round((completed / total) * 100) : 0,
    };
  }
}