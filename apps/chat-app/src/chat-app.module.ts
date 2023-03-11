import { Module } from '@nestjs/common';
import { ChatAppController } from './chat-app.controller';
import { ChatAppService } from './chat-app.service';

@Module({
  imports: [],
  controllers: [ChatAppController],
  providers: [ChatAppService],
})
export class ChatAppModule {}
