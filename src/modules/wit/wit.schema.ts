import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { IDate } from 'src/shared/interfaces/prop.interfaces';

export type WitDocument = Wit & Document;

@Schema()
export class Wit extends Document {
    @Prop({ type: String, required: true })
    phrase: string;

    @Prop({ type: String, required: true })
    translate: string;

    // @Prop({ type: String, default: '' })
    // items: string;
    //
    // @Prop({ type: String, required: true })
    // notes: string;
    //
    // @Prop({
    //     type: String,
    //     default: 'new',
    //     enum: ['new', 'verify', 'archive'],
    // })
    // status: string;
    //
    // @Prop({ type: Object, required: true })
    // created: IDate;

    // @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }] })
    // productsList: Product[];

    // @Prop({ type: [CustomerSchema] })
    // productsList: ICustomer[]; //  Сheck how it works  ?????????
}

export const WitSchema = SchemaFactory.createForClass(Wit);
