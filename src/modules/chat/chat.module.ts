import { Module } from '@nestjs/common';
// import { ChatGateway } from './chat.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './chat.schema';
import { ChatService } from './chat.service';
import { Message, MessageSchema } from './message.schema';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ChatController } from './chat.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Chat.name, schema: ChatSchema },
            { name: Message.name, schema: MessageSchema },
        ]),
        JwtModule.registerAsync({
            useFactory: () => ({ secret: process.env.TOKEN_SECRET,}),
        }),
        // SharedModule,
    ],
    providers: [ChatService ], // , ChatGateway
    controllers: [ChatController],
})
export class ChatModule {}
