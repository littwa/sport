import { Global, Module } from '@nestjs/common';
import { AuxiliaryController } from './auxiliary.controller';
import { AuxiliaryService } from './auxiliary.service';
import { SharedModule } from 'src/shared/shared.module';

@Global()
@Module({
  imports: [SharedModule],
  controllers: [AuxiliaryController],
  providers: [AuxiliaryService],
  // exports: [],
})
export class AuxiliaryModule {}
