import { NestFactory } from '@nestjs/core';
import { NotificationsModule } from './notifications.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(NotificationsModule);

  const config = new DocumentBuilder()
    .setTitle('Notifications Middleware')
    .setDescription('The notification middleware API description')
    .setVersion('1.0')
    .addTag('notifications')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.notificationport ?? 3020);
}
bootstrap();
