import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, ObjectId } from 'mongoose';
import { CreatePostsDto, LikePostDto, PostIdDto, UpdatePostDto } from './dto/posts.dto';
import * as mongoose from 'mongoose';
import { Post, PostDocument, PostSchema } from './posts.schema';
import { Comment, CommentDocument } from 'src/modules/comments/comments.schema';
import { CommentIdDto, CreateCommentDto, LikeCommentDto } from '../comments/dto/comments.dto';
import { User, UserDocument } from '../users/user.schema';
import { EPostsGet } from '../../shared/enums/posts.enum';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
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
    const likedPost = this.postModel.findByIdAndUpdate(
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

  async setOrDelLikePost(postId: string, like: LikePostDto) {
    const [keyUserId, valueLike] = Object.entries(like)[0];

    const post = await this.postModel.findById(postId).exec();
    console.log(10009, post);
    // post.likes[keyUserId] === valueLike ? delete post.likes[keyUserId] : (post.likes[keyUserId] = valueLike);
    if (post.likes[keyUserId] === valueLike) {
      // delete post.likes[keyUserId]; // Does not write down IN DB
      post.likes = (({ [keyUserId]: boolean, ...rest }) => rest)(post.likes);
    } else {
      // post.likes[keyUserId] = valueLike; // Does not write down IN DB
      post.likes = { ...post.likes, [keyUserId]: valueLike };
    }
    await post.save();

    return post;
  }

  async getPostById(postId: string) {
    const post = await this.postModel
      .findById(postId)
      .populate('userId', '_id email firstName lastName username avatarURL city country')
      .exec();

    return post;
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

  async getPostsAggregate(whose = EPostsGet.All, req) {
    const [{ followers, following }] =
      whose === 'following' || whose === 'followers'
        ? await this.userModel.aggregate([
            {
              $match: { _id: new mongoose.Types.ObjectId(req.user._id) },
            },
          ])
        : [{ followers: null, following: null }];

    const cases = {
      following: { userId: { $in: following } },
      followers: { userId: { $in: followers } },
      me: { userId: { $in: [req.user._id] } },
      all: {},
    };
    const query = (whoseCase => cases[whoseCase] || {})(whose);
    // {path: 'userId', select: {}}
    const posts = await this.postModel
      .find(query)
      .populate('userId', '_id email firstName lastName username avatarURL city country');

    if (!posts) throw new NotFoundException(`Can't posts`);

    return posts;
  }

  async getPostsAggTest(whose = EPostsGet.All, req) {
    const findFollowers = await this.userModel.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(req.user._id) },
      },
      {
        $project: { followers: 1 },
      },
      {
        $unwind: {
          path: '$followers',
          preserveNullAndEmptyArrays: false, // default
        },
      },
      // {
      //   $group: {
      //     _id: '$_id',
      //     followers: {
      //       $push: '$followers',
      //     },
      //   },
      // },
    ]);

    // const findPosts = await this.postModel.find({ userId: { $in: [1,2,3] } });

    const findPosts = await this.postModel.aggregate([{ $match: { $expr: { $in: ['followers', findFollowers] } } }]);
    const allPosts = await this.postModel.find({
      // $expr: {
      //   $and: [{ $in: [memberCreator._id, '$participants'] }, { $in: [memberWith._id, '$participants'] }],
      // },
    });

    if (!findPosts) throw new NotFoundException(`Can't allPosts`);

    // return findPosts;

    return 1212;
  }
}
