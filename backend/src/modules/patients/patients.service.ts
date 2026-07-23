import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Patient } from './patient.entity';

@Injectable()
export class PatientsService {
  private readonly logger = new Logger(PatientsService.name);

  constructor(
    @InjectRepository(Patient)
    private patientRepo: Repository<Patient>,
  ) {}

  async create(dto: Partial<Patient>, userId: string): Promise<Patient> {
    const count = await this.patientRepo.count();
    const patient = this.patientRepo.create({
      ...dto,
      patientId: `ML-${String(count + 1).padStart(5, '0')}`,
      createdById: userId,
    });
    return this.patientRepo.save(patient);
  }

  async findAll(query: {
    page?: number; limit?: number; search?: string; status?: string;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const where: any = {};

    if (query.search) {
      where.firstName = Like(`%${query.search}%`);
    }
    if (query.status !== undefined) {
      where.isActive = query.status === 'active';
    }

    const [data, total] = await this.patientRepo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['createdBy'],
    });

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Patient> {
    const patient = await this.patientRepo.findOne({
      where: { id },
      relations: ['createdBy'],
    });
    if (!patient) throw new NotFoundException('Patient not found');
    return patient;
  }

  async update(id: string, dto: Partial<Patient>): Promise<Patient> {
    const patient = await this.findOne(id);
    Object.assign(patient, dto);
    return this.patientRepo.save(patient);
  }

  async remove(id: string): Promise<void> {
    const patient = await this.findOne(id);
    patient.isActive = false;
    await this.patientRepo.save(patient);
  }

  async getStats() {
    const [total, active, monthly] = await Promise.all([
      this.patientRepo.count(),
      this.patientRepo.count({ where: { isActive: true } }),
      this.patientRepo
        .createQueryBuilder('p')
        .select("DATE_TRUNC('month', p.createdAt)", 'month')
        .addSelect('COUNT(*)', 'count')
        .groupBy('month')
        .orderBy('month', 'DESC')
        .limit(12)
        .getRawMany(),
    ]);
    return { total, active, monthly };
  }
}