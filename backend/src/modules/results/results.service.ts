import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestResult } from './result.entity';

@Injectable()
export class ResultsService {
  private readonly logger = new Logger(ResultsService.name);

  constructor(
    @InjectRepository(TestResult)
    private resultRepo: Repository<TestResult>,
  ) {}

  async create(dto: Partial<TestResult>): Promise<TestResult> {
    const result = this.resultRepo.create(dto);
    return this.resultRepo.save(result);
  }

  async findByTest(testId: string): Promise<TestResult> {
    const result = await this.resultRepo.findOne({
      where: { testId },
      relations: ['test', 'test.patient', 'verifiedBy'],
    });
    if (!result) throw new NotFoundException('Result not found for this test');
    return result;
  }

  async update(id: string, dto: Partial<TestResult>): Promise<TestResult> {
    const result = await this.resultRepo.findOne({ where: { id } });
    if (!result) throw new NotFoundException('Result not found');
    Object.assign(result, dto);
    return this.resultRepo.save(result);
  }

  async verify(id: string, userId: string, signature?: string): Promise<TestResult> {
    const result = await this.resultRepo.findOne({ where: { id } });
    if (!result) throw new NotFoundException('Result not found');
    result.verifiedById = userId;
    result.verifiedAt = new Date();
    return this.resultRepo.save(result);
  }

  async getPatientResults(patientId: string) {
    return this.resultRepo.find({
      where: { test: { patientId } },
      relations: ['test', 'verifiedBy'],
      order: { createdAt: 'DESC' },
    });
  }
}