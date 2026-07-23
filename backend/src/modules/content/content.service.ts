import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContentPage } from './content.entity';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(ContentPage)
    private repo: Repository<ContentPage>,
  ) {}

  async getPage(slug: string, lang: string = 'en') {
    let page = await this.repo.findOne({ where: { slug } });
    if (!page) {
      page = await this.repo.save(this.repo.create({ slug, title: slug, content: '' }));
    }
    return page;
  }

  async upsertPage(slug: string, data: Partial<ContentPage>) {
    let page = await this.repo.findOne({ where: { slug } });
    if (page) {
      await this.repo.update(page.id, data);
    } else {
      page = await this.repo.save(this.repo.create({ slug, ...data }));
    }
    return this.repo.findOne({ where: { slug } });
  }
}