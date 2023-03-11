import { NestFactory } from '@nestjs/core';
import { NotificationAppModule } from './notification-app.module';

async function bootstrap() {
  const app = await NestFactory.create(NotificationAppModule);
  await app.listen(3000);
}
bootstrap();
