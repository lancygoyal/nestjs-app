import { Module } from '@nestjs/common';
import { NotificationAppController } from './notification-app.controller';
import { NotificationAppService } from './notification-app.service';

@Module({
  imports: [],
  controllers: [NotificationAppController],
  providers: [NotificationAppService],
})
export class NotificationAppModule {}
