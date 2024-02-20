import { Module } from '@nestjs/common';
import { EmailModule } from 'src/email/email.module';
import { CommonService } from './services/common.service';
import { SocketService } from './services/socket.service';
import { JwtService } from '@nestjs/jwt';

@Module({
    providers: [CommonService, SocketService, JwtService],
    imports: [EmailModule],
    exports: [EmailModule, CommonService, SocketService],
})
export class SharedModule {}
