import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as path from 'path';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  console.log(22211, process.env.NODE_ENV);
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  app.use((req, res, next) => {
    // console.log(333, req.rawHeaders);
    next();
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
