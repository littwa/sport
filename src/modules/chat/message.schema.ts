import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { User, UserDocument } from 'src/modules/users/user.schema';

export type MessageDocument = Message & Document;

@Schema()
export class Message extends Document {
    @Prop({ type: String, required: true })
    message: string;

    @Prop({ type: String, default: new Date().toISOString() })
    created: string;

    @Prop({ type: String, required: true })
    sender: UserDocument;

    @Prop({ type: String, required: true })
    recipient: { [userId: string]: boolean };
}

export const MessageSchema = SchemaFactory.createForClass(Message);
