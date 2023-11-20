import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { EComposeType } from "../../shared/enums/compose.enum";

export type ComposeDocument = Compose & Document;

@Schema()
export class Compose extends Document {
    @Prop({ type: String, required: true })
    expression: string;

    @Prop({ type: String, required: true })
    translate: string;

    @Prop({ type: String, enum: EComposeType, default: EComposeType.Image })
    type: EComposeType;

    @Prop({ type: String, required: true })
    url: string;

    @Prop({type: String, default: '' }) // for del files from cloudinary
    public_id: string;

    @Prop({ type: Boolean, default: false })
    essential: false;

    @Prop({ type: Object, default: {} })
    data: {[key: string]: any};

    @Prop({ type: String, default: Date.now() })
    created: Date;

}

export const ComposeSchema = SchemaFactory.createForClass(Compose);
