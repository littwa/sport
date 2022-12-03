import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as path from 'path';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  console.log('process.env.NODE_ENV in bootstrap() =', process.env.NODE_ENV);
  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn', 'debug', 'verbose'] }); // 'log'
  // app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  app.use((req, res, next) => {
    // console.log(333, req.rawHeaders);
    next();
  });

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Sport')
    .setDescription('The Sport API description')
    .setVersion('0.0.1')
    .addTag('sport')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap().then(() => console.log(' App was started port:', process.env.PORT || 3000));
