import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auxiliary, AuxiliaryDocument } from '../auxiliary/auxiliary.schema';
import { AuxiliaryService } from '../auxiliary/auxiliary.service';
import { Wit, WitDocument } from './wit.schema';
import * as fs from 'fs';
import { CreatePhraseDto, CreateWitItemDto, UpdatePhraseDto } from './dto/wit.dto';
import { Phrase, PhraseDocument } from './phrase.schema';

@Injectable()
export class WitService {
    constructor(
        @InjectModel(Wit.name) private witModel: Model<WitDocument>,
        @InjectModel(Phrase.name) private phraseModel: Model<PhraseDocument>,
        @InjectModel(Auxiliary.name) private auxiliaryModel: Model<AuxiliaryDocument>,
        private auxiliaryService: AuxiliaryService,
    ) {}

    async addList(body: CreateWitItemDto, req): Promise<any> {
        const list = await this.witModel.create({
            ...body,
            userId: req.user._id,
        });

        if (!list) throw new NotFoundException(`Can't create list`);
        return list;
    }

    async createPhrase(body: CreatePhraseDto): Promise<any> {
        return this.phraseModel.create(body);
    }

    async createAndAddPhraseToList(body: CreatePhraseDto, listId: string) {
        const phrase = await this.createPhrase(body);
        const list = await this.witModel
            .findByIdAndUpdate(
                listId,
                {
                    $push: { list: phrase._id },
                },
                { new: true, useFindAndModify: false },
            )
            .populate('list');
        console.log(list, phrase._id);
        if (!list) throw new NotFoundException(`Can't updated list`);
        return phrase;
    }

    async updatePhrase(phraseId: string, body: UpdatePhraseDto): Promise<any> {
        const phrase = await this.phraseModel.findByIdAndUpdate(
            phraseId,
            {
                $set: {
                    ...body,
                },
            },
            { new: true, useFindAndModify: false },
        );

        if (!phrase) throw new NotFoundException(`Can't updated phrase`);
        return phrase;
    }

    async delPhraseFromList(phraseId: string, listId: string) {
        const list = await this.witModel
            .findByIdAndUpdate(
                listId,
                {
                    $pull: { list: phraseId },
                },
                { new: true, useFindAndModify: false },
            )
            .populate('list');

        if (!list) throw new NotFoundException(`Can't updated list`);
        return list;
    }

    async delPhrasePermanently(phraseId: string, listId: string): Promise<any> {
        const list = this.delPhraseFromList(phraseId, listId);
        const phrase = await this.phraseModel.findByIdAndDelete(phraseId);
        if (!phrase) throw new NotFoundException(`Can't del phrase`);
    }

    async delListPermanently(listId: string): Promise<any> {
        // await this.witModel.find({ _id: listId });
        const deleted = await this.witModel.findByIdAndDelete(listId);
        console.log(deleted);
        const phrases = await this.phraseModel.deleteMany({ _id: { $in: deleted.list } });
        console.log(phrases);
    }

    async getLists(req): Promise<any> {
        const lists = await this.witModel.find({ userId: req.user._id });
        if (!lists) throw new NotFoundException(`Can't find lists`);
        return lists;
    }

    async getListAggregate(listId: string, req): Promise<any> {
        const listAgg = await this.witModel.find({ _id: listId }).populate('list');
        if (!listAgg) throw new NotFoundException(`Can't find list`);
        return listAgg;
    }

    async executeAux1(body: any): Promise<any> {
        try {
            // fs.appendFileSync(process.cwd() + '/uploads/files/suspend.json', JSON.stringify(body));
            fs.writeFileSync(process.cwd() + '/uploads/files/suspend.json', JSON.stringify(body));
            console.log('The "data to append" was appended to file!');
        } catch (err) {
            console.log(err);
        }
    }
}
