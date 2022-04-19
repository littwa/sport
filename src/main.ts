import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log(222, process.env.MONGO_URL);
  app.enableCors();
  app.use((req, res, next) => {
    console.log(333, req.rawHeaders);
    next();
  });
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
