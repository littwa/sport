import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { IDate } from 'src/shared/interfaces/prop.interfaces';
import { PhraseDocument } from './phrase.schema';
import { UserDocument } from '../users/user.schema';

export type WitDocument = Wit & Document;

@Schema()
export class Wit extends Document {
    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Phrase' }] })
    list: PhraseDocument[];

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    userId: UserDocument;

    @Prop({ type: Number, default: 0 })
    learn_counter: number;

    @Prop({ type: String, default: Date.now() })
    created: Date;
}

export const WitSchema = SchemaFactory.createForClass(Wit);
