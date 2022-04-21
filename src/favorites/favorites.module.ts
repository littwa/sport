import { Global, Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Favorite, FavoritesSchema } from './favorites.schema';
import { ProductsService } from '../products/products.service';
import { ProductsModule } from '../products/products.module';
// import { OrdersService } from 'src/orders/orders.service';
// import { OrdersModule } from 'src/orders/orders.module';

@Module({
  imports: [
    // ProductsModule,
    MongooseModule.forFeature([
      { name: Favorite.name, schema: FavoritesSchema },
    ]),
  ],
  providers: [FavoritesService],
  controllers: [FavoritesController],
  exports: [FavoritesService, MongooseModule],
})
export class FavoritesModule {}
