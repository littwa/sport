import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { UserDocument } from 'src/modules/users/user.schema';
import { MessageDocument } from 'src/modules/chat/message.schema';
import { EBattleshipsType } from 'src/shared/enums/battleships.enum';
import { IBattleshipsData, IBattleshipsState } from 'src/shared/interfaces/battleships.interfaces';

export type BattleshipsDocument = Battleships & Document;

@Schema()
export class Battleships extends Document {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    server: UserDocument;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    client: UserDocument;

    @Prop({ type: String, required: true })
    created: string;

    @Prop({ type: Object, default: { info: 'no info' } })
    data: IBattleshipsData;

    @Prop({ type: String, default: undefined })
    result: any;

    @Prop({ type: String, enum: EBattleshipsType, required: true })
    type: string;

    @Prop({ type: String, default: null })
    state: IBattleshipsState;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }] })
    messages: MessageDocument[];
}

export const BattleshipsSchema = SchemaFactory.createForClass(Battleships);
