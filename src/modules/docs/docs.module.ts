import { Module } from '@nestjs/common';
import { DocsController } from './docs.controller';
import { DocsService } from './docs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Doc, DocSchema } from './docs.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: Doc.name, schema: DocSchema }])],
    controllers: [DocsController],
    providers: [DocsService],
    // exports: [MongooseModule, DocumentsService],
})
export class DocsModule {}
