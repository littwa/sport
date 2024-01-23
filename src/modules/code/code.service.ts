import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Code, CodeDocument } from './code.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CommonService } from 'src/shared/services/common.service';
import { CodeTag, CodeTagDocument } from 'src/modules/code/code-tag.schema';
import { CodeType, CodeTypeDocument } from 'src/modules/code/code-type.schema';
import { CreateCodeDto, UpdateCodeDto } from 'src/modules/code/dto/code.dto';
import { IRequestExt } from 'src/shared/interfaces/auth.interfaces';
import { UploadApiResponse } from 'cloudinary';
import { ICodeGetQuery, IGetCodeTagsParams, IGetCodeTypeParams } from 'src/shared/interfaces/code.interfaces';

@Injectable()
export class CodeService {
    constructor(
        @InjectModel(Code.name) private codeModel: Model<CodeDocument>,
        @InjectModel(CodeTag.name) private codeTagModel: Model<CodeTagDocument>,
        @InjectModel(CodeType.name) private codeTypeModel: Model<CodeTypeDocument>,
        private commonService: CommonService,
    ) {}

    async createCode(files: Array<Express.Multer.File> = [], body: CreateCodeDto, req: IRequestExt) {
        const file = await this.commonService.cloudinaryHost(files[0], 'code');

        const preparedBody = await this.bodyPrepare(body);

        const code = await this.codeModel.create({
            ...preparedBody,
            author: req.user._id,
            created: Date.now(),
            ...(file && { url: file.secure_url }),
            ...(file && { public_id: file.public_id }),
        });

        if (!code) throw new BadRequestException(`Can't create code`);

        await this.codeTypeModel.findOneAndUpdate(
            { name: body.type },
            {
                $push: { codes: code._id },
            },
            { new: true, useFindAndModify: false },
        );

        await this.codeTagModel.updateMany(
            { name: { $in: body.tags } },
            {
                $push: { codes: code._id },
            },
        );

        return await code.populate(['tags', 'type', 'author']);
    }

    async delCode(id: string) {
        const deletedCode = await this.codeModel.findByIdAndDelete(id).populate('type').populate('tags');
        if (!deletedCode) throw new NotFoundException(`Can't del code.`);

        await this.codeTypeModel.findOneAndUpdate(
            { name: deletedCode.type?.name },
            {
                $pull: { codes: deletedCode._id },
            },
            { new: true, useFindAndModify: false },
        );

        await this.codeTagModel.updateMany(
            { name: { $in: deletedCode.tags.map(t => t?.name) } },
            {
                $pull: { codes: deletedCode._id },
            },
        );

        const cloudinaryResponse = await this.commonService.deleteFromCloudinary(deletedCode.public_id, 'image');

        return { cloudinaryResponse, deletedCode };
    }

    async updateCode(id: string, file: Express.Multer.File, body: UpdateCodeDto) {
        let img: UploadApiResponse | undefined;
        try {
            if (file && body.public_id) {
                img = await this.commonService.cloudinaryHost(file, 'code');
                await this.commonService.deleteFromCloudinary(body.public_id, 'image');
            }
        } catch (err) {
            throw new NotFoundException(err);
        }

        let code: CodeDocument = await this.codeModel.findByIdAndUpdate(id).exec();
        const codePopulated = await code.populate(['tags', 'type']);

        const beingTags = codePopulated.tags.map(v => v.name);
        const tagsForDelCodeRef = body.tags && codePopulated.tags.filter(v => !body.tags?.includes(v.name));
        const newTags = body.tags && body.tags.filter(v => !beingTags?.includes(v));

        const tags: CodeTagDocument[] = await this.addTags(body.tags);
        const type: CodeTypeDocument = body.type && (await this.addType(body.type));

        try {
            if (tagsForDelCodeRef?.length) {
                await this.codeTagModel.updateMany(
                    { name: { $in: tagsForDelCodeRef.map(t => t?.name) } },
                    {
                        $pull: { codes: id },
                    },
                );
            }

            if (newTags?.length) {
                await this.codeTagModel.updateMany(
                    { name: { $in: newTags } },
                    {
                        $push: { codes: id },
                    },
                );
            }

            if (body.type && body.type !== codePopulated.type.name) {
                await this.codeTypeModel.findOneAndUpdate(
                    { name: codePopulated.type.name },
                    {
                        $pull: { codes: id },
                    },
                    { new: true, useFindAndModify: false },
                );

                await this.codeTypeModel.findOneAndUpdate(
                    { _id: type },
                    {
                        $push: { codes: id },
                    },
                    { new: true, useFindAndModify: false },
                );
            }
        } catch (err) {
            throw new BadRequestException(err);
        }

        img && (code.url = img.secure_url);
        img && (code.public_id = img.public_id);
        type && (code.type = type);
        tags?.length && (code.tags = tags);
        body.description && (code.description = body.description);
        body.data && (code.data = body.data);

        await code.save();

        if (!code) throw new BadRequestException(`Can't updated code`);

        await code.populate(['tags', 'type', 'author']);

        return {
            tags: code.tags.map(v => v.name),
            type: code.type.name,
            author: code.author._id,
            _id: code._id,
            description: code.description,
            url: code.url,
            public_id: code.public_id,
            created: code.created,
            data: code.data,
        };
    }

    async getCodes(query: ICodeGetQuery, req: IRequestExt) {
        const { page_size = 10, current_page = 1, ...filtrate } = query;
        const skip = current_page * page_size - page_size;

        typeof query.tags === 'string' && (query.tags = [query.tags]);
        console.log('query: ', query);
        const result = await this.codeModel.aggregate([
            {
                $lookup: {
                    from: 'codetags',
                    localField: 'tags',
                    foreignField: '_id',
                    as: 'tags',
                },
            },
            {
                $unwind: {
                    path: '$tags',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: 'codetypes',
                    localField: 'type',
                    foreignField: '_id',
                    as: 'type',
                },
            },
            {
                $addFields: {
                    tags: '$tags.name',
                    type: '$type.name',
                },
            },
            {
                $group: {
                    _id: '$_id',
                    author: { $first: '$author' },
                    url: { $first: '$url' },
                    public_id: { $first: '$public_id' },
                    created: { $first: '$created' },
                    data: { $first: '$data' },
                    description: { $first: '$description' },
                    type: { $first: { $arrayElemAt: ['$type', 0] } },
                    tags: { $push: '$tags' },
                },
            },
            {
                $match: {
                    $and: [
                        { author: new mongoose.Types.ObjectId(req.user._id) },
                        ...(query.description ? [{ description: new RegExp(query.description, 'i') }] : []),
                        ...(query.type ? [{ type: query.type }] : []),
                        ...(query.tags ? [{ tags: { $all: query.tags } }] : []),
                    ],
                },
            },
            {
                $facet: {
                    body: [
                        {
                            $sort: {
                                _id: -1,
                            },
                        },
                        {
                            $skip: skip,
                        },
                        {
                            $limit: +page_size,
                        },
                        {
                            $project: {
                                __v: 0,
                            },
                        },
                    ],
                    pagination: [
                        {
                            $count: 'count',
                        },
                    ],
                },
            },
            {
                $project: {
                    body: 1,
                    pagination: {
                        $arrayElemAt: ['$pagination', 0],
                    },
                },
            },
            {
                $addFields: {
                    'pagination.page_size': +page_size,
                    'pagination.current_page': +current_page,
                },
            },
        ]);

        return result[0];
    }

    async bodyPrepare(body: CreateCodeDto): Promise<CreateCodeDto> {
        const tags = await this.addTags(body.tags);
        const type = await this.addType(body.type);
        return { ...body, type, tags };
    }

    async addTags(tags: string[]) {
        if (!tags?.length) return [];
        const hasTags = await this.codeTagModel.find({ name: { $in: tags } });
        tags = tags.filter(t => !hasTags.map(v => v.name).includes(t));

        let arr: Promise<any>[] = [];
        for (let i = 0; i < tags.length; i += 1) {
            const tag = this.codeTagModel.create({ name: tags[i] });
            arr.push(tag);
        }
        const documents = await Promise.all(arr);
        if (arr.length && !documents?.length) throw new BadRequestException(`Can't create tags`);
        return [...documents.map(t => t._id), ...hasTags.map(v => v._id)];
    }

    async addType(type: string) {
        if (!type) throw new BadRequestException(`No field type`);
        const hasType = await this.codeTypeModel.findOne({ name: type });
        if (hasType) return hasType._id;
        const newType = await this.codeTypeModel.create({ name: type });
        return newType._id;
    }

    async findCodeTypes({ name }: IGetCodeTypeParams, req: IRequestExt) {
        const res = await this.codeTypeModel.find({ ...(name && { name: { $regex: name, $options: 'i' } }) }).limit(5);
        return res;
    }

    async findCodeTags({ name }: IGetCodeTagsParams, req: IRequestExt) {
        return await this.codeTagModel.find({ ...(name && { name: { $regex: name, $options: 'i' } }) }).limit(5);
    }

    async getAllCodeTags() {
        return await this.codeTagModel.find({});
    }
}
