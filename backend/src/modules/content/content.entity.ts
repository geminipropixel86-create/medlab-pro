import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('content_pages')
export class ContentPage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  slug: string;

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

  @Column({ type: 'jsonb', nullable: true })
  meta: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}