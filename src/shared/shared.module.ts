import { Module } from '@nestjs/common';
import { EmailModule } from 'src/email/email.module';
import { CommonService } from './services/common.service';

@Module({
    providers: [CommonService],
    imports: [EmailModule],
    exports: [EmailModule, CommonService],
})
export class SharedModule {}
