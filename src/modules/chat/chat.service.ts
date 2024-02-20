import { Injectable } from '@nestjs/common';
import { Chat, ChatDocument } from './chat.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Socket } from 'socket.io';
import { CreateChatDto } from './dto/chat.dto';
import { Message, MessageDocument } from './message.schema';
import { IChat } from 'src/shared/interfaces/chat.interfaces';

@Injectable()
export class ChatService {
    constructor(
        @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
        @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    ) {}

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
        if (!socket?.data?.decode?.payload?.uid) {
            return;
        }
        const updChat = this.chatModel.findByIdAndUpdate(
            chat._id,
            { $pull: { usersList: socket.data.decode.payload.uid } },
            { new: true },
        );
        return updChat;
    }

    async removeUserFromAllChats(socket) {
        if (!socket?.data?.decode?.payload?.uid) {
            return;
        }

        const updChats = await this.chatModel.updateMany({}, { $pull: { usersList: socket.data.decode.payload.uid } });
        console.log(
            updChats.matchedCount,
            updChats.modifiedCount,
            updChats.acknowledged,
            updChats.upsertedId,
            updChats.upsertedCount,
        );

        console.log('socket.data.decode.payload.uid::: ', socket.data.decode.payload.uid);
        // console.log('updChats::: ', updChats);
    }

    async addMessage(data, sender: Socket) {
        console.log('addMessage::: ', data, sender.data.decode.payload.uid);
        const message = await this.messageModel.create({ ...data, author: sender.data.decode.payload.uid });
        const chat = await this.chatModel
            .findByIdAndUpdate(data.chat, { $push: { messages: message._id } }, { new: true })
            .populate('messages');
        return {
            event: 'addition_message',
            data: { message: await message.populate('author'), chat: chat },
        };
    }

    async getAllChats() {
        return await this.chatModel.find().populate('author').populate('messages');
    }
}
