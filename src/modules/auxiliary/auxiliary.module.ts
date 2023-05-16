import { Global, Module } from '@nestjs/common';
import { AuxiliaryController } from './auxiliary.controller';
import { AuxiliaryService } from './auxiliary.service';
import { SharedModule } from 'src/shared/shared.module';
import { Product, ProductSchema } from '../products/products.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Auxiliary, AuxiliarySchema } from './auxiliary.schema';

@Global()
@Module({
    imports: [SharedModule, MongooseModule.forFeature([{ name: Auxiliary.name, schema: AuxiliarySchema }])],
    controllers: [AuxiliaryController],
    providers: [AuxiliaryService],
    exports: [MongooseModule],
})
export class AuxiliaryModule {}
