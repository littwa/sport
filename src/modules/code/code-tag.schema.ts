import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { Code, CodeDocument } from 'src/modules/code/code.schema';

export type CodeTagDocument = CodeTag & Document;

@Schema()
export class CodeTag extends Document {
    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Code' }] })
    codes: CodeDocument[];
}

export const CodeTagSchema = SchemaFactory.createForClass(CodeTag);
