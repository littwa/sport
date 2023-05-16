import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../orders/orders.schema';
import { Auxiliary, AuxiliaryDocument } from './auxiliary.schema';
import { BRANDS, CHARACTERISTICS } from 'src/shared/constants/product.constants';

@Injectable()
export class AuxiliaryService {
    constructor(@InjectModel(Auxiliary.name) private auxiliaryModel: Model<AuxiliaryDocument>) {
        // this.initConfig();
    }

    async initConfig() {
        const docs = await this.auxiliaryModel.create({ characteristics: CHARACTERISTICS, brands: BRANDS });
        console.log('initConfig!!!!');
        // return docs;
        // return await this.docsModel.find({});
    }

    async getConfigFromDB() {
        const conf = await this.auxiliaryModel.find();
        return conf;
    }
}
