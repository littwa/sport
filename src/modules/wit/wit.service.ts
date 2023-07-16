import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auxiliary, AuxiliaryDocument } from '../auxiliary/auxiliary.schema';
import { AuxiliaryService } from '../auxiliary/auxiliary.service';
import { Wit, WitDocument } from './wit.schema';

@Injectable()
export class WitService {
    constructor(
        @InjectModel(Wit.name) private witModel: Model<WitDocument>,
        @InjectModel(Auxiliary.name) private auxiliaryModel: Model<AuxiliaryDocument>,
        private auxiliaryService: AuxiliaryService,
    ) {}

    async addItem(body: any): Promise<any> {
        return await this.witModel.create(body);
    }
}
