import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { getModelToken } from '@nestjs/mongoose';
import { NotificationDocument } from './entities/notification.entity';
import { HttpService } from '@nestjs/axios';
import { Model, Schema } from 'mongoose';
import { NotificationsRepository } from './notifications.repository';
import { v4 } from 'uuid';

describe('NotificationsController', () => {
  let controller: NotificationsController;
  let mockService: NotificationsService;

  beforeEach(async () => {
    const mockMongooseTokens = [
      {
        provide: getModelToken(NotificationDocument.name),
        useValue: Model<NotificationDocument>,
      },
      {
        provide: HttpService,
        useValue: {},
      },
    ];

    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [
        ...mockMongooseTokens,
        NotificationsService,
        NotificationsRepository,
      ],
    }).compile();

    controller = module.get<NotificationsController>(NotificationsController);
    mockService = module.get<NotificationsService>(NotificationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(mockService).toBeDefined();
  });

  it('should be create, update and get notification', async () => {
    const notification = new NotificationDocument();
    const id = v4();
    const companyId = v4();
    const userId = v4();
    notification._id = new Schema.Types.ObjectId(id);
    notification.companyId = companyId;
    notification.userId = userId;
    notification.content = 'Test Content';
    notification.subject = 'Test Subject';
    notification.sentDate = new Date();

    jest.spyOn(mockService, 'create').mockResolvedValue({
      result: 'ok',
    });

    const result = await controller.create({
      companyId: companyId,
      userId: userId,
      notificationType: 'leave-balance-reminder',
    });

    expect(result.result).toBe('ok');

    jest.spyOn(mockService, 'findAll').mockResolvedValue([notification]);

    const allResult = await controller.findAll(companyId, userId);

    expect(allResult.length).toBe(1);
  });
});
