import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Chat, ChatDocument } from './chat.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/user.schema';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Server, Socket } from 'socket.io';
import { UsersService } from '../users/users.service';
import { WsException } from '@nestjs/websockets';
import { CreateChatDto } from './dto/chat.dto';
import { Message, MessageDocument } from './message.schema';
import { from, Observable, of } from 'rxjs';
import { IChat } from '../../shared/interfaces/chat.interfaces';

@Injectable()
export class ChatService {
    private ticketToken = 'jwtExpires._60Seconds';

    constructor(
        @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
        private jwtService: JwtService,
        private configService: ConfigService,
        private usersService: UsersService,
    ) {}

    async createWsTicket({ _id }) {
        const user = await this.userModel.findOne(
            {
                _id,
            },
            { password: 0 },
        );
        if (!user) throw new BadRequestException('User was not found');

        const token = this.jwtService.sign(
            {
                uid: user._id,
                secret: process.env.TOKEN_SECRET,
                email: user.email,
                role: user.role,
            },
            { expiresIn: this.configService.get(this.ticketToken).exp },
        );

        return { token };
    }

    async checkUserFromSocket(socket: Socket) {
        const { authorization } = socket.handshake.headers;

        let result: { [key: string]: any };

        try {
            result = await this.usersService.verifyToken(authorization);
        } catch (err) {
            result = {
                error: 'unauthorized',
                message: 'expired jwt token',
                status: 401,
            };
        }

        // UnauthorizedException
        // console.log(88888888888888888, result)
        // if (!user) {
        //     throw new WsException('Invalid credentials.');
        // }
        return result;
    }

    async addChat(data: CreateChatDto, sender: Socket) {
        const chat = await this.chatModel.create({ ...data, author: sender.data.decode.payload.uid });
        return { event: 'add-chat', data: chat };
    }

    async joinChat(chat: IChat, socket: Socket) {
        const updChat = this.chatModel.findByIdAndUpdate(
            chat._id,
            { $addToSet: { usersList: socket.data.decode.payload.uid } },
            { new: true },
        );
        return updChat;
    }

    async leaveChat(chat, socket) {
        if(!socket?.data?.decode?.payload?.uid){
            return
        }
        const updChat = this.chatModel.findByIdAndUpdate(
            chat._id,
            { $pull: { usersList: socket.data.decode.payload.uid } },
            { new: true },
        );
        return updChat;
    }

    async removeUserFromAllChats(socket) {
        if(!socket?.data?.decode?.payload?.uid){
            return
        }

        const updChats = await this.chatModel.updateMany(
            {},
            { $pull: { usersList: socket.data.decode.payload.uid } }
        );
        console.log(updChats.matchedCount, updChats.modifiedCount,
        updChats.acknowledged,
        updChats.upsertedId,
        updChats.upsertedCount)

        console.log('socket.data.decode.payload.uid::: ', socket.data.decode.payload.uid);
        // console.log('updChats::: ', updChats);
    }

    async addMessage(data, sender: Socket) {
        console.log('addMessage::: ', data, sender.data.decode.payload.uid);
        const message = await this.messageModel.create({ ...data, author: sender.data.decode.payload.uid });
        const chat = await this.chatModel.findByIdAndUpdate(
            data.chat,
            { $push: { messages: message._id } },
            { new: true },
        ).populate('messages');
        return {
            event: 'addition_message',
            data: { message: await message.populate('author'), chat: chat },
        };
    }

    async getAllChats() {
        return await this.chatModel.find().populate('author').populate('messages');
    }
}
