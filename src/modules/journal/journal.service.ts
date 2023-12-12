import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Journal, JournalDocument, JournalSchema } from './journal.schema';
import { Model } from 'mongoose';
import { CreateEntryDto, UpdateEntryDto } from './dto/journal.dto';
import { IRequestExt } from 'src/shared/interfaces/auth.interfaces';
import { EMonthJournal, EYearJournal } from 'src/shared/enums/journal.enum';

@Injectable()
export class JournalService {
    constructor(@InjectModel(Journal.name) private journalModel: Model<JournalDocument>) {}

    async add(body: CreateEntryDto, req: IRequestExt) {
        const entry = await this.journalModel.findOne({ day: body.day, month: body.month, year: body.year });
        if (entry) throw new BadRequestException(`Entry already exist for this day`);
        return await this.journalModel.create({ ...body, author: req.user._id, date: this.prepareDateUtility(body) });
    }

    async update(body: UpdateEntryDto, id: string, req: IRequestExt) {
        const upd = await this.journalModel.findByIdAndUpdate(
            id,
            {
                $set: body,
            },
            { new: true, useFindAndModify: false },
        );
        if (!upd) throw new BadRequestException(`Can't updated journal entry`);
        return upd;
    }

    async delete(id: string) {
        const deleted = await this.journalModel.findByIdAndDelete(id);
        if(!deleted) throw new BadRequestException(`Can't delete journal entry`);
    }

    async getMonthEntry(month: EMonthJournal, year: EYearJournal, req: IRequestExt) {
        return await this.journalModel.find({
            author: req.user._id,
            month,
            year,
        });
    }

    prepareDateUtility(body: CreateEntryDto) {
        return `${body.month} ${body.day}, ${body.year}`;
    }
}
