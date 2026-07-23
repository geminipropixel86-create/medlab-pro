import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PriceItem } from './price-item.entity';

@Injectable()
export class PricingService {
  constructor(
    @InjectRepository(PriceItem)
    private repo: Repository<PriceItem>,
  ) {}

  async create(dto: Partial<PriceItem>): Promise<PriceItem> {
    return this.repo.save(this.repo.create(dto));
  }

  async findAll(query: { page?: number; limit?: number; category?: string }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const where: any = { isActive: true };
    if (query.category) where.category = query.category;

    const [data, total] = await this.repo.findAndCount({
      where, skip: (page - 1) * limit, take: limit,
      order: { name: 'ASC' },
    });
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async getCategories() {
    return this.repo
      .createQueryBuilder('p')
      .select('DISTINCT p.category')
      .where('p.isActive = true')
      .orderBy('p.category')
      .getRawMany();
  }

  async update(id: string, dto: Partial<PriceItem>) {
    await this.repo.update(id, dto);
    return this.repo.findOne({ where: { id } });
  }
}