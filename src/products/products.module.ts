import { Global, Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './products.schema';
import { OrdersService } from 'src/orders/orders.service';
import { OrdersModule } from 'src/orders/orders.module';
import { FavoritesModule } from '../favorites/favorites.module';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [ProductsService, MongooseModule],
})
export class ProductsModule {}
