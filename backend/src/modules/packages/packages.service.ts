import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestPackage } from './package.entity';

@Injectable()
export class PackagesService {
  constructor(
    @InjectRepository(TestPackage)
    private repo: Repository<TestPackage>,
  ) {}

  async create(dto: Partial<TestPackage>): Promise<TestPackage> {
    return this.repo.save(this.repo.create(dto));
  }

  async findAll(query: { page?: number; limit?: number; isActive?: boolean }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const where: any = {};
    if (query.isActive !== undefined) where.isActive = query.isActive;

    const [data, total] = await this.repo.findAndCount({
      where, skip: (page - 1) * limit, take: limit,
      order: { sortOrder: 'ASC' },
    });
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string): Promise<TestPackage> {
    const pkg = await this.repo.findOne({ where: { id } });
    if (!pkg) throw new NotFoundException('Package not found');
    return pkg;
  }

  async update(id: string, dto: Partial<TestPackage>): Promise<TestPackage> {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.repo.delete(id);
    if (!result.affected) throw new NotFoundException('Package not found');
  }
}