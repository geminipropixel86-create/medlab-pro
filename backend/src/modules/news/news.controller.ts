import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsArticle } from './news.entity';

@Controller('api/news')
export class NewsController {
  constructor(private service: NewsService) {}

  @Post()
  create(@Body() dto: Partial<NewsArticle>): Promise<NewsArticle> {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() query: {
    page?: string; limit?: string; category?: string;
    isActive?: string; featured?: string; lang?: string;
  }) {
    const q: any = {};
    if (query.page) q.page = parseInt(query.page, 10);
    if (query.limit) q.limit = parseInt(query.limit, 10);
    if (query.category) q.category = query.category;
    if (query.isActive !== undefined) q.isActive = query.isActive === 'true';
    if (query.featured !== undefined) q.featured = query.featured === 'true';
    return this.service.findAll(q);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<NewsArticle> {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: Partial<NewsArticle>): Promise<NewsArticle> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }
}