import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import * as mongoose from 'mongoose';
// import { Order } from 'src/orders/orders.schema';

export type SessionDocument = Session & Document;

@Schema()
export class Session extends Document {
    @Prop({ type: mongoose.Schema.Types.ObjectId }) // check
    uid: string;

    @Prop({ type: Number, required: true })
    expRefreshToken: number;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
