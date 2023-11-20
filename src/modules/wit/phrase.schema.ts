import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { IDate } from 'src/shared/interfaces/prop.interfaces';
import { EPhraseDifficult, EPhraseResults, EPhraseType } from '../../shared/enums/wit.enum';

export type PhraseDocument = Phrase & Document;

@Schema()
export class Phrase extends Document {
    @Prop({ type: String, required: true })
    phrase: string;

    @Prop({ type: String, required: true })
    translate: string;

    @Prop({ type: String, default: 'sentiment_satisfied' })
    label: string; // mat-icon font ligature

    @Prop({ type: String, default: EPhraseType.Phrase, enum: EPhraseType })
    type: string;

    @Prop({ type: String, default: EPhraseDifficult.Easy, enum: EPhraseDifficult })
    difficult: string;

    @Prop({ type: Array, default: [] })
    results: EPhraseResults[];

    @Prop({ type: Object })
    statistics: any;

    @Prop({ type: String, default: Date.now() })
    created: Date;

}

export const PhraseSchema = SchemaFactory.createForClass(Phrase);
