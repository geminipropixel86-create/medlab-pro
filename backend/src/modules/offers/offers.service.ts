import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import { Offer } from './offer.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer) private repo: Repository<Offer>,
  ) {}

  async create(dto: Partial<Offer>): Promise<Offer> {
    return this.repo.save(this.repo.create(dto));
  }

  async findAll() {
    return this.repo.find({
      where: { isActive: true },
      order: { validUntil: 'ASC' },
    });
  }

  async getActive() {
    return this.repo.find({
      where: {
        isActive: true,
        validFrom: LessThan(new Date()),
        validUntil: MoreThan(new Date()),
      },
      order: { discountPercentage: 'DESC' },
    });
  }

  async update(id: string, dto: Partial<Offer>) {
    await this.repo.update(id, dto);
    return this.repo.findOne({ where: { id } });
  }
}