import configuration from 'src/shared/configs/base.config';
import {
  Injectable,
  MiddlewareConsumer,
  Module,
  NestMiddleware,
  NestModule,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { CustomersModule } from './customers/customers.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { DocsModule } from './docs/docs.module';
import { NextFunction } from 'express';
import { PassportModule } from '@nestjs/passport';
import { FavoritesModule } from './favorites/favorites.module';
import { ProductsService } from './products/products.service';

@Module({
  imports: [
    PassportModule,
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    UsersModule,
    CustomersModule,
    OrdersModule,
    ProductsModule,
    DocsModule,
    FavoritesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
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

// {
//   provide: APP_GUARD,
//   useClass: RolesGuard,
// },
