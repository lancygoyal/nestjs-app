import { NestFactory } from '@nestjs/core';
import { ChatAppModule } from './chat-app.module';

async function bootstrap() {
  const app = await NestFactory.create(ChatAppModule);
  await app.listen(3000);
}
bootstrap();
