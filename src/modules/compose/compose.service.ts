import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Compose, ComposeDocument, ComposeSchema } from './compose.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ComposeList, ComposeListDocument } from './compose-list.schema';
import { CreateComposeDto, UpdateComposeDto } from './dto/compose.dto';
import { CommonService } from '../../shared/services/common.service';
import { EComposeType } from '../../shared/enums/compose.enum';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class ComposeService {
    constructor(
        @InjectModel(Compose.name) private composeModel: Model<ComposeDocument>,
        @InjectModel(ComposeList.name) private composeListModel: Model<ComposeListDocument>,
        private commonService: CommonService,
    ) {}

    async addComposeList(data, req) {
        return await this.composeListModel.create({ ...data, author: req.user._id });
    }

    async delListAndComposes(id: string): Promise<any> {
        const deleted = await this.composeListModel.findByIdAndDelete(id);
        const compose = await this.composeModel.deleteMany({ _id: { $in: deleted.list } });
    }

    async createComposeAndAddToList(file: Express.Multer.File, body: CreateComposeDto, listId: string) {
        const img = await this.commonService.cloudinaryHost(file);
        const compose = await this.composeModel.create({ ...body, url: img.secure_url, public_id: img.public_id });
        const list = await this.composeListModel
            .findByIdAndUpdate(
                listId,
                {
                    $push: { list: compose._id },
                },
                { new: true, useFindAndModify: false },
            )
            .populate('list');

        if (!list) throw new NotFoundException(`Can't updated list`);
        return compose;
    }

    async delComposePermanently(composeId: string, listId: string) {
        const list = await this.composeListModel
            .findByIdAndUpdate(
                listId,
                {
                    $pull: { list: composeId },
                },
                { new: true, useFindAndModify: false },
            )
            .populate('list');

        if (!list) throw new NotFoundException(`Can't updated compose list`);

        const compose = await this.composeModel.findByIdAndDelete(composeId);
        if (!compose) throw new NotFoundException(`Can't del compose`);

        const cloudinaryResponse = await this.commonService.deleteFromCloudinary(compose.public_id, compose.type);

    }

    async updateCompose(id: string, file: Express.Multer.File, body: UpdateComposeDto): Promise<any> {
        let img: UploadApiResponse | undefined;
        let cloudinaryResponse: any;
        try {
            if (file && body.public_id) {
                img = await this.commonService.cloudinaryHost(file);
                cloudinaryResponse = await this.commonService.deleteFromCloudinary(
                    body.public_id,
                    body.old_file_type === EComposeType.Image ? EComposeType.Image : EComposeType.Video,
                );
            }
        } catch (err) {
            throw new NotFoundException(err);
        }

        const compose = await this.composeModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    ...(body.expression && { expression: body.expression }),
                    ...(body.translate && { translate: body.translate }),
                    ...(body.type && { type: body.type }),
                    ...(img?.secure_url && { url: img.secure_url }),
                    ...(img?.public_id && { public_id: img.public_id }),
                },
            },
            { new: true, useFindAndModify: false },
        );

        if (!compose) throw new BadRequestException(`Can't updated compose`);
        return compose;
    }

    async getComposeLists(req): Promise<any> {
        const lists = await this.composeListModel.find({ author: req.user._id });
        if (!lists) throw new NotFoundException(`Can't find compose lists`);
        return lists;
    }

    async getComposeListAggregate(listId: string): Promise<any> {
        const listAgg = await this.composeListModel.find({ _id: listId }).populate('list');
        if (!listAgg) throw new NotFoundException(`Can't find list`);
        return listAgg[0];
    }
}
