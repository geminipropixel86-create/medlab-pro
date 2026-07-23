import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { TestPackage } from './package.entity';

@Controller('api/packages')
export class PackagesController {
  constructor(private service: PackagesService) {}

  @Post()
  create(@Body() dto: Partial<TestPackage>): Promise<TestPackage> {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() query: { page?: string; limit?: string; isActive?: string }) {
    const q: any = {};
    if (query.page) q.page = parseInt(query.page, 10);
    if (query.limit) q.limit = parseInt(query.limit, 10);
    if (query.isActive !== undefined) q.isActive = query.isActive === 'true';
    return this.service.findAll(q);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<TestPackage> {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: Partial<TestPackage>): Promise<TestPackage> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }
}