import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './products.schema';
import { addLeadingZeros, filterObject } from 'src/utility/utilities';
import { CreateProductDto, RateDto, UpdateProductDto } from './dto/product.dto';
import { PRODUCT_UPDATE_KEYS } from 'src/shared/constants/product.constants';
import { productsSubCategoryValidators } from '../../validators/products.validators';
import { ProductsCategoryEnum } from '../../shared/enums/products.enum';

@Injectable()
export class ProductsService {
    constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}

    async getProducts() {
        const allProducts = await this.productModel.find();
        console.log(34543);
        if (!allProducts) throw new NotFoundException(`Can't get Products`);
        return allProducts;
    }

    async getProductById(productId) {
        const product = await this.productModel.findById(productId).populate('reviews');
        return product;
    }

    async addProduct(createProductDto: CreateProductDto) {
        try {
            if (
                productsSubCategoryValidators(
                    createProductDto.category as ProductsCategoryEnum,
                    createProductDto.subCategory,
                )
            ) {
                throw new NotFoundException(`Invalid Products Sub Category`);
            }

            const lastProduct = await this.productModel.find().sort({ _id: -1 }).limit(1);
            const code = this.generateCodeUtility(lastProduct[0]);
            // const newProduct = await this.productModel.create({ ...createProductDto, code });
            // if (!newProduct) throw new NotFoundException(`Can't create Product in DB`);
            return await this.productModel.create({ ...createProductDto, code });
        } catch (err) {
            throw new NotFoundException({ error: `Can't create Product`, message: err.message });
        }
    }

    async updateProduct(updateProductDto: UpdateProductDto, productId) {
        const updateProduct = filterObject(updateProductDto, PRODUCT_UPDATE_KEYS);
        const updatedProduct = await this.productModel.findByIdAndUpdate(
            productId,
            { $set: updateProduct },
            { new: true, useFindAndModify: false },
        );

        return !updatedProduct ? new NotFoundException(`Can't update Product id: ${productId}`) : updatedProduct;
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
