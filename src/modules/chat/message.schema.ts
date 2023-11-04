import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { User, UserDocument } from 'src/modules/users/user.schema';
import {IChatData} from "../../shared/interfaces/chat.interfaces";
import {ChatDocument} from "./chat.schema";

export type MessageDocument = Message & Document;

@Schema()
export class Message extends Document {
    @Prop({ type: String, required: true })
    text: string;

    @Prop({ type: String, default: new Date().toISOString() })
    created: string;

    @Prop({ type: Object, default:  { info: 'no info' } })
    data: IChatData;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Chat' })
    author: ChatDocument;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    chat: UserDocument;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    replyTo: UserDocument;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
