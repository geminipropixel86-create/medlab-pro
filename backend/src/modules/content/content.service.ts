import { Injectable } from '@nestjs/common';

@Injectable()
export class ContentService {
  private pages = new Map<string, any>();

  async getPage(slug: string) {
    return this.pages.get(slug) || { slug, content: null };
  }

  async upsertPage(slug: string, content: any) {
    this.pages.set(slug, { slug, ...content, updatedAt: new Date() });
    return this.pages.get(slug);
  }
}