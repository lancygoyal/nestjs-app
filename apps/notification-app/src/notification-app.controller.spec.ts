import { Test, TestingModule } from '@nestjs/testing';
import { NotificationAppController } from './notification-app.controller';
import { NotificationAppService } from './notification-app.service';

describe('NotificationAppController', () => {
  let notificationAppController: NotificationAppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [NotificationAppController],
      providers: [NotificationAppService],
    }).compile();

    notificationAppController = app.get<NotificationAppController>(NotificationAppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(notificationAppController.getHello()).toBe('Hello World!');
    });
  });
});
