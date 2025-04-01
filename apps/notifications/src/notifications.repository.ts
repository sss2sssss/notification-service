import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { NotificationDocument } from './entities/notification.entity';

@Injectable()
export class NotificationsRepository extends AbstractRepository<NotificationDocument> {
  protected readonly logger = new Logger(NotificationsRepository.name);
  constructor(
    @InjectModel(NotificationDocument.name)
    protected readonly notificationModel: Model<NotificationDocument>,
  ) {
    super(notificationModel);
  }
}
