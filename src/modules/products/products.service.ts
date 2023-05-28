import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './products.schema';
import { addLeadingZeros, defineCategory, filterObject, prepareQueryFilter } from 'src/utility/utilities';
import { CreateProductDto, RateDto, UpdateProductDto } from './dto/product.dto';
// import { PRODUCT_UPDATE_KEYS } from 'src/shared/constants/product.constants';
import { characteristicsValidators, productsSubCategoryValidators } from 'src/validators/products.validators';
import { ProductsCategoryEnum, ProductsSubCategoryEnum } from 'src/shared/enums/products.enum';
import { AuxiliaryModule } from '../auxiliary/auxiliary.module';
import { Auxiliary, AuxiliaryDocument } from '../auxiliary/auxiliary.schema';
import { AuxiliaryService } from '../auxiliary/auxiliary.service';
import { IGetProdParam } from '../../shared/interfaces/products.interfaces';

@Injectable()
export class ProductsService {
    constructor(
        @InjectModel(Product.name) private productModel: Model<ProductDocument>,
        @InjectModel(Auxiliary.name) private auxiliaryModel: Model<AuxiliaryDocument>,
        private auxiliaryService: AuxiliaryService,
    ) {}

    async getProducts(req, query: any, param: IGetProdParam) {
        console.log(req.user._id, query, param);
        // const filter = { name: 'PS3' };
        // const filter2 = { ...(param.category && { subCategory: param.category }) };
        // const regex = new RegExp(filter.name, 'i');
        const { page_size, current_page, sort, ...filtrate } = query;
        // const pageSize = 3; //  +req.query.page_size;
        // const currentPage = 1; // +req.query.current_page;
        const skip = current_page * page_size - page_size;
        console.log(10001, skip, page_size, current_page, sort);

        const queryCategory = defineCategory(param);
        let match: any = {};
        if (queryCategory) {
            match = { $and: [queryCategory] };
        }

        if (queryCategory.sub_category) {
            const filter = prepareQueryFilter(filtrate);

            match.$and.push(...filter);
            console.log(10007, match);
        }

        console.log(100009, { $sort: { [sort]: 1 } })
        const result = await this.productModel.aggregate([
            {
                // $match: { $or: [{ name: { $regex: regex } }, { description: { $regex: regex } }] },
                // $match: { $or: [{ 'characteristics.typeConsole': { $regex: regex } }] },
                $match: match,
            },
            { $sort: { [sort]: 1 } },
            {
                $facet: {
                    result: [
                        { $sort: { [sort]: 1 } },
                        {
                            $skip: skip,
                        },
                        {
                            $limit: +page_size,
                        },
                        {
                            $project: {
                                // createdAt: 0,
                                // updatedAt: 0,
                                __v: 0,
                            },
                        },
                    ],
                    count: [
                        {
                            $count: 'count',
                        },
                    ],
                },
            },
            {
                $project: {
                    result: 1,
                    count: {
                        // $set: { $asa: 1 },
                        $arrayElemAt: ['$count', 0],
                        // $setField: {
                        //     field: '$tst',
                        //     // input: <Object>,
                        //     value: 1,
                        // },
                    },
                    // qw: { $setField: { field: 'test', input: '$$ROOT', value: 5 } },
                },
            },
            {
                $addFields: {
                    'count.page_size': +page_size,
                    'count.current_page': +current_page,
                    'count.sort': sort,
                },
            },
        ]);

        return result;

        // const allProducts = await this.productModel.find();
        // const allProducts = await this.productModel.find();
        // if (!allProducts) throw new NotFoundException(`Can't get Products`);
        // return allProducts;
    }

    async getProductById(productId) {
        const product = await this.productModel.findById(productId).populate('reviews');
        return product;
    }

    async addProduct(dto: CreateProductDto) {
        try {
            if (productsSubCategoryValidators(dto.category as ProductsCategoryEnum, dto.sub_category)) {
                throw new NotFoundException(`Invalid Products Sub Category`);
            }

            const [isInvalid, necessaryCharacteristics] = characteristicsValidators(dto);
            if (isInvalid) {
                throw new NotFoundException(`Value: ${necessaryCharacteristics.toString()} - is necessary!`);
            }

            // console.log(90000, await this.auxiliaryService.getConfigFromDB());

            const lastProduct = await this.productModel.find().sort({ _id: -1 }).limit(1);
            const code = this.generateCodeUtility(lastProduct[0]);
            // const newProduct = await this.productModel.create({ ...createProductDto, code });
            // if (!newProduct) throw new NotFoundException(`Can't create Product in DB`);
            console.log(dto);
            return await this.productModel.create({ ...dto, code });
        } catch (err) {
            throw new NotFoundException({ error: `Can't create Product`, message: err.message });
        }
    }

    async updateProduct(dto: UpdateProductDto, productId) {
        try {
            if (
                !(!dto.category && !dto.sub_category) &&
                productsSubCategoryValidators(dto.category as ProductsCategoryEnum, dto.sub_category)
            ) {
                throw new NotFoundException(`Invalid Products Sub Category`);
            }

            const [characteristics, rest] = (({ characteristics, ...rest }) => [characteristics, rest])(dto);
            const ch = characteristics
                ? Object.fromEntries(Object.entries(characteristics).map(([k, v]) => ['characteristics.' + k, v]))
                : {};

            const updatedProduct = await this.productModel.findByIdAndUpdate(
                productId,
                { $set: { ...rest, ...ch } },
                { new: true, useFindAndModify: false },
            );

            return !updatedProduct ? new NotFoundException(`Can't update Product id: ${productId}`) : updatedProduct;
        } catch (err) {
            throw new NotFoundException({ error: `Can't update Product`, message: err.message });
        }
    }

    async deleteProduct(productId) {
        const deletedProduct = await this.productModel.findByIdAndDelete(productId);
        if (!deletedProduct) throw new NotFoundException(`Can't del Product`);
        // Because @HttpCode(HttpStatus.NO_CONTENT) no return
        // return `Product ById: ${productId} has been deleted!`; //
    }

    async giveRatingProduct(rate: RateDto, productId) {
        const [keyUserId, valueRate] = Object.entries(rate)[0];
        const ratedProduct = this.productModel.findByIdAndUpdate(
            productId,
            {
                $set: { [`rating.${keyUserId}`]: valueRate },
            },
            {
                new: true,
                useFindAndModify: false,
            },
        );

        // const ratedProduct = await this.productModel.aggregate([{ $match: { _id: productId } }]);

        // let p;
        // const ratedProduct = await this.productModel.findById(productId, function (err, product) {
        //   // if (err) ..
        //   product.stars = { ...product.stars, ...stars };
        //   // product.save();
        //   console.log(100003, product);
        //   p = product;
        // });
        //
        //console.log(1000011, ratedProduct);

        return ratedProduct;
    }

    generateCodeUtility(lastProduct): string {
        return lastProduct ? addLeadingZeros(Number.parseInt(lastProduct.code) + 1, 7) : '0000001';
    }
}
