import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import { User } from 'src/modules/users/user.schema';
import * as mongoose from 'mongoose';
import { CodeType, CodeTypeDocument } from './code-type.schema';
import { CodeTag, CodeTagDocument } from './code-tag.schema';

export type CodeDocument = Code & Document;

@Schema()
export class Code extends Document {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    author: User;

    @Prop({ type: String, required: true })
    description: string;

    @Prop({ type: String, default: '' })
    url: string;

    @Prop({ type: String, default: '' }) // for del files from cloudinary;
    public_id: string;

    @Prop({ type: String, default: Date.now() })
    created: Date;

    @Prop({ type: Object, default: {} })
    data: { [key: string]: any };

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'CodeType', required: true })
    type: CodeTypeDocument;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CodeTag', default: [] }] })
    tags: CodeTagDocument[];
}

export const CodeSchema = SchemaFactory.createForClass(Code);
