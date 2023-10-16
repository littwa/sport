import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { User, UserDocument } from 'src/modules/users/user.schema';
import {ProductDocument} from "../products/products.schema";
import { Message, MessageDocument} from "./message.schema";

export type ChatDocument = Chat & Document;

@Schema()
export class Chat extends Document {

    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: String, default: new Date().toISOString() })
    created: string;

    @Prop({ type: String, required: true })
    author: UserDocument;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }] })
    messages: MessageDocument[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
