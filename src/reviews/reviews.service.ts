import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument, ReviewSchema } from 'src/reviews/reviews.schema';
import { Product, ProductDocument } from 'src/products/products.schema';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) public reviewsModel: Model<ReviewDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async createReview(body, req) {
    const newReview = await this.reviewsModel.create({ ...body, user: req.user, product: body.productId });
    const updatedProduct = await this.productModel.findByIdAndUpdate(
      body.productId,
      {
        $push: { reviews: newReview._id },
      },
      {
        new: true,
        useFindAndModify: false,
      },
    );

    return { newReview, updatedProduct };
  }

  async deleteReview(reviewId) {
    const deletedReview = await this.reviewsModel.findByIdAndDelete(reviewId);
    const updatedProduct = await this.productModel.findByIdAndUpdate(
      deletedReview.product,
      {
        $pull: { reviews: reviewId },
      },
      {
        new: true,
        useFindAndModify: false,
      },
    );
    console.log(204, deletedReview, updatedProduct);
    // return { deletedReview, updatedProduct };
  }
}
