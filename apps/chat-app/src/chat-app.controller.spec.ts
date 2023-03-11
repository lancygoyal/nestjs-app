import { Test, TestingModule } from '@nestjs/testing';
import { ChatAppController } from './chat-app.controller';
import { ChatAppService } from './chat-app.service';

describe('ChatAppController', () => {
  let chatAppController: ChatAppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ChatAppController],
      providers: [ChatAppService],
    }).compile();

    chatAppController = app.get<ChatAppController>(ChatAppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(chatAppController.getHello()).toBe('Hello World!');
    });
  });
});
