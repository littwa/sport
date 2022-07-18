import { HttpCode, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Product, ProductDocument } from './products.schema';
import { addLeadingZeros, filterObject } from 'src/utility/utilities';
import { CreateProductDto, RateDto, UpdateProductDto } from './dto/product.dto';
import { PRODUCT_UPDATE_KEYS } from 'src/shared/constants/product.constants';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}

  async getProducts() {
    const allProducts = await this.productModel.find();
    if (!allProducts) throw new NotFoundException(`Can't get Products`);
    return allProducts;
  }

  async addProduct(createProductDto: CreateProductDto) {
    const lastProduct = await this.productModel.find().sort({ _id: -1 }).limit(1);

    const code = this.generateCodeUtility(lastProduct[0]);

    const newProduct = await this.productModel.create({ ...createProductDto, code });
    if (!newProduct) throw new NotFoundException(`Can't create Product`);

    return newProduct;
  }

  async updateProduct(updateProductDto: UpdateProductDto, productId) {
    const updateProduct = filterObject(updateProductDto, PRODUCT_UPDATE_KEYS);
    const updatedProduct = await this.productModel.findByIdAndUpdate(
      productId,
      {
        $set: updateProduct,
      },
      {
        new: true,
        useFindAndModify: false,
      },
    );

    return !updatedProduct ? new NotFoundException(`Can't update Product id: ${productId}`) : updatedProduct;
  }

  async deleteProduct(productId) {
    const deletedProduct = await this.productModel.findByIdAndDelete(productId);
    if (!deletedProduct) throw new NotFoundException(`Can't del Product`);
    console.log('deletedProduct', deletedProduct, productId);

    // Because @HttpCode(HttpStatus.NO_CONTENT) no return
    // return `Product ById: ${productId} has been deleted!`;
  }

  async giveRatingProduct(rate: RateDto, productId) {
    const ratedProduct = await this.productModel.aggregate([{ $match: { _id: productId } }]);
    console.log(1000011, ratedProduct);

    // const ratedProduct = this.productModel.findByIdAndUpdate(
    //   productId,
    //   {
    //     $addFields: { stars: { rate } },
    //   },
    //   {
    //     new: true,
    //     useFindAndModify: false,
    //   },
    // );

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
