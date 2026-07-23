import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { NewsArticle } from './news.entity';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(NewsArticle)
    private repo: Repository<NewsArticle>,
  ) {}

  async create(dto: Partial<NewsArticle>): Promise<NewsArticle> {
    if (!dto.publishDate) dto.publishDate = new Date();
    return this.repo.save(this.repo.create(dto));
  }

  async findAll(query: {
    page?: number; limit?: number; category?: string;
    isActive?: boolean; featured?: boolean; lang?: string;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const where: any = {};
    if (query.isActive !== undefined) where.isActive = query.isActive;
    else where.isActive = true;
    if (query.category) where.category = query.category;
    if (query.featured) where.isFeatured = true;
    where.publishDate = LessThanOrEqual(new Date());

    const [data, total] = await this.repo.findAndCount({
      where, skip: (page - 1) * limit, take: limit,
      order: { publishDate: 'DESC', createdAt: 'DESC' },
    });
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string): Promise<NewsArticle> {
    const article = await this.repo.findOne({ where: { id } });
    if (!article) throw new NotFoundException('Article not found');
    return article;
  }

  async update(id: string, dto: Partial<NewsArticle>): Promise<NewsArticle> {
    await this.repo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.repo.delete(id);
    if (!result.affected) throw new NotFoundException('Article not found');
  }
}