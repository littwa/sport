import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument, ReviewSchema } from 'src/modules/reviews/reviews.schema';
import { Product, ProductDocument } from 'src/modules/products/products.schema';
import { EditDto, LikeDto } from './dto/reviews.dto';

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

  async editReview(body: EditDto, reviewId: string) {
    const editedReview = await this.reviewsModel.findByIdAndUpdate(
      reviewId,
      {
        $set: { review: body.review, tags: body.tags },
      },
      {
        new: true,
        useFindAndModify: false,
      },
    );
    return editedReview;
  }

  async setLike(like: LikeDto, reviewId) {
    const [keyUserId, valueLike] = Object.entries(like)[0];
    const likedReview = this.reviewsModel.findByIdAndUpdate(
      reviewId,
      {
        $set: { [`likes.${keyUserId}`]: valueLike },
      },
      {
        new: true,
        useFindAndModify: false,
      },
    );

    return likedReview;
  }
}
