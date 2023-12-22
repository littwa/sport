import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Code, CodeDocument } from './code.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { CommonService } from 'src/shared/services/common.service';
import { CodeTag, CodeTagDocument } from 'src/modules/code/code-tag.schema';
import { CodeType, CodeTypeDocument } from 'src/modules/code/code-type.schema';
import { CreateCodeDto, UpdateCodeDto } from './dto/code.dto';
import { IRequestExt } from 'src/shared/interfaces/auth.interfaces';
import { EComposeType } from '../../shared/enums/compose.enum';
import { UploadApiResponse } from 'cloudinary';

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

        file && (code.url = img.secure_url);
        file && (code.public_id = img.public_id);
        type && (code.type = type);
        tags?.length && (code.tags = tags);
        body.description && (code.description = body.description);
        body.data && (code.data = body.data);

        await code.save();

        if (!code) throw new BadRequestException(`Can't updated code`);
        return code;
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
        const hasType = await this.codeTypeModel.findOne({ name: type });
        if (hasType) return hasType._id;
        const newType = await this.codeTypeModel.create({ name: type });

        return newType._id;
    }
}
