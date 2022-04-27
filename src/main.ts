import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log(2222, process.env.NODE_ENV);
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.use((req, res, next) => {
    // console.log(333, req.rawHeaders);
    next();
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
