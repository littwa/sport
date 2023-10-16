import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './chat.schema';
import { ChatService } from './chat.service';
import { Message, MessageDocument, MessageSchema } from './message.schema';
import { JwtService } from '@nestjs/jwt';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Chat.name, schema: ChatSchema },
            { name: Message.name, schema: MessageSchema },
        ]),
    ],
    providers: [JwtService, ChatService, ChatGateway],
})
export class ChatModule {}
