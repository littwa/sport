import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from 'src/products/products.module';
import { ProductsService } from 'src/products/products.service';
import { OrdersController } from './orders.controller';
import { Order, OrderSchema } from './orders.schema';
import { OrdersService } from './orders.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]), ProductsModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService, MongooseModule]
})
export class OrdersModule { }
