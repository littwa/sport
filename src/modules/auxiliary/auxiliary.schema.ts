import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type AuxiliaryDocument = Auxiliary & Document;

@Schema()
export class Auxiliary extends Document {
    @Prop({ type: Object, required: true })
    characteristics: any;

    @Prop({ type: Array, required: true })
    brands: any;

    @Prop({ type: Array, required: true })
    witLists: any;
}

export const AuxiliarySchema = SchemaFactory.createForClass(Auxiliary);
