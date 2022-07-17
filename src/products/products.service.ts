import { HttpCode, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './products.schema';
import { addLeadingZeros } from 'src/utility/utilities';
import { createProductDto, updateProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}

  async getProducts() {
    const allProducts = await this.productModel.find();
    if (!allProducts) throw new NotFoundException(`Can't get Products`);
    return allProducts;
  }

  async addProduct(createProductDto: createProductDto) {
    const lastProduct = await this.productModel.find().sort({ _id: -1 }).limit(1);
    console.log(100005, lastProduct);
    const code = this.generateCodeUtility(lastProduct[0]);
    console.log(100009, code);
    const newProduct = await this.productModel.create({ ...createProductDto, code });
    if (!newProduct) throw new NotFoundException(`Can't create Product`);
    console.log('newGoods=', newProduct);
    return newProduct;
  }

  async updateProduct(createProductDto: updateProductDto, productId) {
    console.log(100006, createProductDto);
    const updatedProduct = await this.productModel.findByIdAndUpdate(
      productId,
      {
        $set: createProductDto,
      },
      {
        new: true,
        useFindAndModify: false,
      },
      // (err, doc) => {
      //   // doc = { ...doc, ...createProductDto };
      //   // doc.save();
      //   console.log(10001, err, doc);
      //   // doc.save();
      // },
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

  generateCodeUtility(lastProduct): string {
    return lastProduct ? addLeadingZeros(Number.parseInt(lastProduct.code) + 1, 7) : '0000001';
  }
}
