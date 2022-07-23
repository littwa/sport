import configuration from 'src/shared/configs/base.config';
import { Global, Injectable, MiddlewareConsumer, Module, NestMiddleware, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { CustomersModule } from './customers/customers.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { DocsModule } from './docs/docs.module';
import { NextFunction } from 'express';
import { PassportModule } from '@nestjs/passport';
import { FavoritesModule } from './favorites/favorites.module';
import { ProductsService } from './products/products.service';
import { TesterModule } from './tester/tester.module';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { serveStaticOptions, storage } from 'src/config/config-entity';
import * as multer from 'multer';
import { ReviewsModule } from './reviews/reviews.module';
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
      load: [configuration],
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
