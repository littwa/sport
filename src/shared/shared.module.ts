import { Module } from '@nestjs/common';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [EmailModule],
  exports: [EmailModule],
})
export class SharedModule {}
