import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Doc, DocDocument } from './docs.schema';
import { Model } from 'mongoose';

@Injectable()
export class DocsService {
    constructor(@InjectModel(Doc.name) private docsModel: Model<DocDocument>) {}

    async getDocs(param, req) {
        const docs = await this.docsModel.find({});
        console.log('docs=', docs);
        return docs;
        // return await this.docsModel.find({});
    }

    async addDocs(body) {
        await this.docsModel.create(body);
    }
}
