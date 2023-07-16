import { Module } from '@nestjs/common';
import { WitController } from './wit.controller';
import { Wit, WitSchema } from './wit.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { WitService } from './wit.service';
import { AuxiliaryService } from '../auxiliary/auxiliary.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Wit.name, schema: WitSchema }])],
    controllers: [WitController],
    providers: [WitService, AuxiliaryService],
    exports: [],
})
export class WitModule {}
