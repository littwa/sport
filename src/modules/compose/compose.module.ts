import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Compose, ComposeSchema } from './compose.schema';
import { ComposeList, ComposeListSchema } from './compose-list.schema';
import {ComposeController} from "./compose.controller";
import {ComposeService} from "./compose.service";
import {AuxiliaryService} from "../auxiliary/auxiliary.service";
import {CommonService} from "../../shared/services/common.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Compose.name, schema: ComposeSchema },
            { name: ComposeList.name, schema: ComposeListSchema },
        ]),
    ],
    controllers: [ComposeController],
    providers: [ComposeService, AuxiliaryService, CommonService]
})
export class ComposeModule {}
