import { NestFactory } from '@nestjs/core';
import { CompanysModule } from './companys.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(CompanysModule);

  const config = new DocumentBuilder()
    .setTitle('Companys Middleware')
    .setDescription('The company middleware API description')
    .setVersion('1.0')
    .addTag('companys')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.companyport ?? 3021);
}
bootstrap();
