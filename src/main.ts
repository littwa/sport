import {HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as path from 'path';
import { BadRequestException, UnauthorizedException, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from "./filters/http.exception.filter";
// import baseConfig from 'src/shared/configs/base.config';

async function bootstrap() {
    console.log('process.env.NODE_ENV in bootstrap() =', process.env.NODE_ENV);
    const app = await NestFactory.create(AppModule, { logger: ['error', 'warn', 'debug', 'verbose'] }); // 'log'
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe());

    const { httpAdapter } = app.get(HttpAdapterHost);

    app.useGlobalFilters(new HttpExceptionFilter(httpAdapter)); // , new AllExceptionsFilter()
    // app.useGlobalFilters(new AllExceptionsFilter());
    // app.use(baseConfig);

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

    app.listen(process.env.PORT || 3000);
}
bootstrap().then(() => console.log(' App was started port:', process.env.PORT || 3000));
