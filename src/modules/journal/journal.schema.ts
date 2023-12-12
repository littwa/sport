import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { EComposeType } from '../../shared/enums/compose.enum';
import { User } from '../users/user.schema';
import { EDayJournal, EMonthJournal, EYearJournal } from '../../shared/enums/journal.enum';

export type JournalDocument = Journal & Document;

@Schema()
export class Journal extends Document {
    @Prop({ type: String, required: true, enum: EDayJournal })
    day: EDayJournal;

    @Prop({ type: String, required: true, enum: EMonthJournal })
    month: EMonthJournal;

    @Prop({ type: String, required: true, enum: EYearJournal })
    year: EYearJournal;

    @Prop({ type: String, required: true })
    entry: string;

    @Prop({ type: String, required: true })
    date: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    author: User;

    @Prop({ type: Object, default: {} })
    data: { [key: string]: any };

    @Prop({ type: String, default: Date.now() })
    created: Date;
}

export const JournalSchema = SchemaFactory.createForClass(Journal);
