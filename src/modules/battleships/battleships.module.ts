import { Chat, ChatSchema } from '../chat/chat.schema';
import { Message, MessageSchema } from '../chat/message.schema';
import { ChatService } from '../chat/chat.service';
import { ChatGateway } from '../chat/chat.gateway';
import { ChatController } from '../chat/chat.controller';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { BattleshipsService } from './battleships.service';
import { BattleshipsGateway } from './battleships.gateway';
import { BattleshipsController } from './battleships.controller';
import { Battleships, BattleshipsSchema } from './battleships.schema';
import {SharedModule} from "../../shared/shared.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Battleships.name, schema: BattleshipsSchema },
            // { name: Message.name, schema: MessageSchema },
        ]),
        JwtModule.registerAsync({
            useFactory: () => ({ secret: process.env.TOKEN_SECRET }),
        }),
        SharedModule,
    ],
    providers: [BattleshipsService, BattleshipsGateway],
    controllers: [BattleshipsController],
})
export class BattleshipsModule {}
