import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Notification, NotificationChannel, NotificationStatus } from './notification.entity';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectRepository(Notification)
    private notifRepo: Repository<Notification>,
  ) {}

  async create(dto: Partial<Notification>): Promise<Notification> {
    const notif = this.notifRepo.create(dto);
    return this.notifRepo.save(notif);
  }

  async sendResultAlert(patientId: string, patientName: string, testName: string, channels: NotificationChannel[]) {
    const notifications = channels.map((channel) => ({
      patientId,
      title: 'Test Result Available',
      message: `Hello ${patientName}, your ${testName} result is now available. Please check your patient portal.`,
      channel,
      status: NotificationStatus.PENDING,
    }));
    return this.notifRepo.save(notifications);
  }

  async getUserNotifications(userId: string, page = 1, limit = 20) {
    const [data, total] = await this.notifRepo.findAndCount({
      where: { userId, channel: NotificationChannel.IN_APP },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async markAsRead(id: string) {
    return this.notifRepo.update(id, {
      status: NotificationStatus.READ,
      readAt: new Date(),
    });
  }

  async markAllAsRead(userId: string) {
    return this.notifRepo.update(
      { userId, status: NotificationStatus.SENT, channel: NotificationChannel.IN_APP },
      { status: NotificationStatus.READ, readAt: new Date() },
    );
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notifRepo.count({
      where: { userId, status: NotificationStatus.SENT, channel: NotificationChannel.IN_APP },
    });
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async processPendingNotifications() {
    const pending = await this.notifRepo.find({
      where: { status: NotificationStatus.PENDING },
      take: 50,
    });
    for (const notif of pending) {
      try {
        // Simulate sending — in production, dispatch to Firebase/SMS/WhatsApp/Email
        this.logger.log(`Processing ${notif.channel} notification: ${notif.id}`);
        notif.status = NotificationStatus.SENT;
        notif.sentAt = new Date();
        await this.notifRepo.save(notif);
      } catch (err) {
        this.logger.error(`Failed to send notification ${notif.id}`, err);
        notif.status = NotificationStatus.FAILED;
        await this.notifRepo.save(notif);
      }
    }
  }
}