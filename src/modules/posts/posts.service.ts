import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, ObjectId } from 'mongoose';
import { CreatePostsDto, LikePostDto, PostIdDto, UpdatePostDto } from './dto/posts.dto';
import * as mongoose from 'mongoose';
import { Post, PostDocument } from './posts.schema';
import { Comment, CommentDocument } from 'src/modules/comments/comments.schema';
import { CommentIdDto, CreateCommentDto, LikeCommentDto } from '../comments/dto/comments.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async createPosts(createPostsDto: CreatePostsDto, req) {
    const post = await this.postModel.create({
      ...createPostsDto,
      userId: req.user._id,
    });

    if (!post) throw new NotFoundException(`Can't create post`);
    return post;
  }

  async updatePost(postId, updatePostDto: UpdatePostDto) {
    console.log(10000444, updatePostDto);
    const updatedPost = await this.postModel.findByIdAndUpdate(
      postId,
      {
        $set: {
          ...updatePostDto,
        },
      },
      { new: true, useFindAndModify: false },
    );

    if (!updatedPost) throw new NotFoundException(`Can't updated post`);
    return updatedPost;
  }

  async deletePost(postId: string) {
    const deletedPost = await this.postModel.findByIdAndDelete(postId);
    if (!deletedPost) throw new NotFoundException(`Can't del post`);
    console.log(100005, deletedPost);
    // return `Post ById: ${postId} has been successfully deleted!`;
  }

  async setLikePost(postId: string, like: LikePostDto) {
    const [keyUserId, valueLike] = Object.entries(like)[0];
    const likedPost = this.commentModel.findByIdAndUpdate(
      postId,
      {
        $set: { [`likes.${keyUserId}`]: valueLike },
      },
      {
        new: true,
        useFindAndModify: false,
      },
    );

    return likedPost;
  }

  async addCommentToPost(postId: string, createCommentDto: CreateCommentDto) {
    const comment = await this.commentModel.create(createCommentDto);
    if (!comment) throw new NotFoundException(`Can't create comment`);
    const commentedPost = await this.postModel.findByIdAndUpdate(
      postId,
      {
        $push: { comments: comment._id },
      },
      {
        new: true,
      },
    );

    console.log(commentedPost);

    if (!commentedPost) throw new NotFoundException(`Can't commented Post`);

    return commentedPost;
  }

  async deleteCommentFromPost(postId: string, commentIdDto: CommentIdDto) {
    const deletedComment = await this.commentModel.findByIdAndDelete(commentIdDto.commentId);

    if (!deletedComment) throw new NotFoundException(`Can't remove comment from this post`);

    const updatedPost = await this.postModel.findByIdAndUpdate(
      postId,
      {
        $pull: { comments: commentIdDto.commentId },
      },
      { new: true },
    );

    return updatedPost;
  }

  async getPostsAggregate(postsBy: string) {
    const allPosts = await this.postModel.find(); ////////////////////////////////////////!!!!!!
    if (!allPosts) throw new NotFoundException(`Can't allPosts`);
    return allPosts;
  }

  // async getOrdersWithProducts(body: GetOrderDto) {
  //   console.log(100000222, body.userId);
  //   const aggregate = await this.orderModel
  //     .find(body.userId ? { userId: body.userId } : {})
  //     .populate('userId')
  //     .populate('productsList');
  //   if (!aggregate) throw new NotFoundException(`Can't aggregate orders`);
  //   return aggregate;
  // }

  //
  // async changeOrderStatus(orderId, status) {
  //   const updatedOrder: any = await this.orderModel.findByIdAndUpdate(
  //     orderId,
  //     {
  //       $set: { status },
  //     },
  //     {
  //       new: true,
  //       useFindAndModify: false,
  //     },
  //   );
  //
  //   if (!updatedOrder) throw new NotFoundException(`Can't change status order id:${orderId}`);
  //   return updatedOrder;
  // }
}
