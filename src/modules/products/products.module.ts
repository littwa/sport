import { Global, Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './products.schema';
import { AuxiliaryModule } from '../auxiliary/auxiliary.module';
import { AuxiliaryService } from '../auxiliary/auxiliary.service';

@Global()
@Module({
    imports: [MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }])],
    providers: [
        AuxiliaryService,
        // ProductsService
        { provide: 'ProductsServiceToken', useClass: ProductsService }, // For Example approach
    ],
    controllers: [ProductsController],
    exports: [
        // ProductsService,
        { provide: 'ProductsServiceToken', useClass: ProductsService }, // For Example approach
        MongooseModule,
    ],
})
export class ProductsModule {}
