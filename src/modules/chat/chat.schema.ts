import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { User, UserDocument } from 'src/modules/users/user.schema';
import {ProductDocument} from "../products/products.schema";
import { Message, MessageDocument} from "./message.schema";
import {IChatData} from "../../shared/interfaces/chat.interfaces";
import {EChatType} from "../../shared/enums/chat.enum";

export type ChatDocument = Chat & Document;

@Schema()
export class Chat extends Document {

    @Prop({ type: String, required: true })
    name: string;

    @Prop({type: String, enum: EChatType, default: EChatType.Extraordinary })
    type: string;

    @Prop({ type: String, default: new Date().toISOString() })
    created: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    author: UserDocument;

    @Prop({type: Boolean, default: false })
    private: boolean;

    @Prop({ type: Object, default:  { info: 'no info' } })
    data: IChatData;

    @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]})
    privateUsersList: UserDocument[]

    @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]})
    usersList: UserDocument[]

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }] })
    messages: MessageDocument[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
