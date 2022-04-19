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
import configuration from 'src/shared/configs/base.config';
import { UsersModule } from 'src/users/users.module';
import { CustomersModule } from './customers/customers.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { DocumentsModule } from './documents/documents.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './users/authorization/roles.guard';
import { NextFunction } from 'express';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from './users/users.service';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from "./users/strategies/google.strategy";
import { LocalStrategy } from "./users/strategies/local.strategy";
import { JwtStrategy } from "./users/strategies/jwt.strategy";

@Module({
  imports: [
    PassportModule,
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    UsersModule,
    CustomersModule,
    OrdersModule,
    ProductsModule,
    DocumentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  // providers: [GoogleStrategy, LocalStrategy, JwtStrategy],
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
