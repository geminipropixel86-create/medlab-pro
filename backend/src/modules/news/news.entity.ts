import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('news_announcements')
export class NewsArticle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  title: string;

  @Column({ length: 200, nullable: true })
  titleAr: string;

  @Column({ length: 200, nullable: true })
  titleCkb: string;

  @Column({ length: 200, nullable: true })
  titleKmr: string;

  @Column('text')
  content: string;

  @Column('text', { nullable: true })
  contentAr: string;

  @Column('text', { nullable: true })
  contentCkb: string;

  @Column('text', { nullable: true })
  contentKmr: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ length: 50, default: 'general' })
  category: string; // general, offer, update, health-tip

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'date', nullable: true })
  publishDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}