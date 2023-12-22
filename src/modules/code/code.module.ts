import { Module } from '@nestjs/common';
import { CodeController } from './code.controller';
import { CodeService } from './code.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Code, CodeSchema } from './code.schema';
import { CodeType, CodeTypeSchema } from './code-type.schema';
import { CodeTag, CodeTagSchema } from './code-tag.schema';
import {CommonService} from "../../shared/services/common.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Code.name, schema: CodeSchema },
            { name: CodeType.name, schema: CodeTypeSchema },
            { name: CodeTag.name, schema: CodeTagSchema },
        ]),
    ],
    controllers: [CodeController],
    providers: [CodeService, CommonService],
    exports: [],
})
export class CodeModule {}
