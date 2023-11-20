import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { IDate } from 'src/shared/interfaces/prop.interfaces';
import { UserDocument } from '../users/user.schema';
import {ComposeDocument} from "./compose.schema";

export type ComposeListDocument = ComposeList & Document;

@Schema()
export class ComposeList extends Document {
    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Compose' }] })
    list: ComposeDocument[];

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    author: UserDocument;

    @Prop({ type: String, default: Date.now() })
    created: Date;
}

export const ComposeListSchema = SchemaFactory.createForClass(ComposeList);
