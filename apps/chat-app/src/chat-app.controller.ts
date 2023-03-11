import { Controller, Get } from '@nestjs/common';
import { ChatAppService } from './chat-app.service';

@Controller()
export class ChatAppController {
  constructor(private readonly chatAppService: ChatAppService) {}

  @Get()
  getHello(): string {
    return this.chatAppService.getHello();
  }
}
