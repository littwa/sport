import { Module } from '@nestjs/common';
import { JournalController } from './journal.controller';
import { JournalService } from './journal.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Journal, JournalSchema } from "./journal.schema";

@Module({
  imports: [MongooseModule.forFeature([{name: Journal.name, schema: JournalSchema}])],
  controllers: [JournalController],
  providers: [JournalService]
})
export class JournalModule {

}
