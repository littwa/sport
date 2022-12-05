import { configuration } from 'src/shared/configs/base.config';
import { Global, Injectable, MiddlewareConsumer, Module, NestMiddleware, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/modules/users/users.module';
import { CustomersModule } from './modules/customers/customers.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ProductsModule } from './modules/products/products.module';
import { DocsModule } from './modules/docs/docs.module';
import { NextFunction } from 'express';
import { PassportModule } from '@nestjs/passport';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { ProductsService } from './modules/products/products.service';
import { TesterModule } from './modules/tester/tester.module';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { serveStaticOptions, storage } from 'src/config/config-entity';
import * as multer from 'multer';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { CommentsModule } from './modules/comments/comments.module';
import { PostsModule } from './modules/posts/posts.module';

const storage2 = multer.diskStorage({
  destination: 'uploads',
  // destination: function (req, file, cb) {
  //   cb(null, 'uploads');
  // },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    const ext = path.parse(file.originalname).ext;
    cb(null, uniqueSuffix + ext);
  },
});

// @Global()
@Module({
  imports: [
    PassportModule,
    ConfigModule.forRoot({
      load: [() => ({
        nodemailerTransporterConfig: {
          transport: {
            host: 'smtp.gmail.com',
            secure: false,
            // port: 465,
            auth: {
              user: process.env.NODEMAILER_USER,
              pass: process.env.NODEMAILER_PASSWORD,
            },
          },
          defaults: {
            from: '"No Reply" <noreply@example.com>',
          },
        },
        jwtExpires: {
          _30days: {
            exp: '30d',
            expIncrement: 2592000000,
          },
          _60Seconds: {
            exp: '60s',
            expIncrement: 60000,
          },
          _300Seconds: {
            exp: '300s',
            expIncrement: 300000,
          },
          _1hour: {
            exp: '1h',
            expIncrement: 3600000,
          },
        },
      })],
      isGlobal: true,
      envFilePath: ['.env'], // not necessary
    }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    // MulterModule.registerAsync({ useFactory: () => ({ storage: storage2 }) }),
    // MulterModule.register({ storage }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    UsersModule,
    CustomersModule,
    OrdersModule,
    ProductsModule,
    DocsModule,
    ReviewsModule,
    FavoritesModule,
    TesterModule,
    CommentsModule,
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [], // ConfigModule, ProductsModule,
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('users/test-jwt');
    // throw new Error('Method not implemented.');
  }
}

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('LoggerMiddleware...users/test-jwt');
    next();
  }
}
