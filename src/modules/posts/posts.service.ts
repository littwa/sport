import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import { CreatePostsDto, LikePostDto, UpdatePostDto } from './dto/posts.dto';
import { Post, PostDocument } from './posts.schema';
import { Comment, CommentDocument } from 'src/modules/comments/comments.schema';
import { CommentIdDto, CreateCommentDto } from '../comments/dto/comments.dto';
import { User, UserDocument } from '../users/user.schema';
import { EPostsGet } from '../../shared/enums/posts.enum';
import { PAGINATION_POSTS_DEFAULT } from '../../shared/constants/posts.contstants';
import { ESortOrderBy } from '../../shared/enums/common.enum';
import { IPreResponse } from '../../shared/interfaces/posts.interfaces';

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
    const updatedPost = await this.postModel
      .findByIdAndUpdate(
        postId,
        {
          $set: {
            ...updatePostDto,
          },
        },
        { new: true, useFindAndModify: false },
      )
      .populate('userId', '_id email firstName lastName username avatarURL city country');

    if (!updatedPost) throw new NotFoundException(`Can't updated post`);
    return updatedPost;
  }

  async deletePost(postId: string) {
    const deletedPost = await this.postModel.findByIdAndDelete(postId);
    if (!deletedPost) throw new NotFoundException(`Can't del post`);
    console.log(10005, deletedPost);
    // return `Post ById: ${postId} has been successfully deleted!`;
  }

  async setOrDelLikePost(postId: string, like: LikePostDto) {
    const [keyUserId, valueLike] = Object.entries(like)[0];

    const post = await this.postModel.findById(postId).exec();
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
      .populate({
        path: 'comments',
        populate: { path: 'userId', select: '_id email firstName lastName username avatarURL city country' },
        options: {
          sort: {
            _id: -1,
          },
        },
      });

    return post;
  }

  async addCommentToPost(postId: string, createCommentDto: CreateCommentDto, req) {
    const comment = await this.commentModel.create({ ...createCommentDto, userId: req.user._id });
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

    return comment.populate('userId', '_id email firstName lastName username avatarURL city country');
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

    return { ...commentIdDto, postId };
  }

  async getPostsAggregate(whose = EPostsGet.All, req, pagination): Promise<IPreResponse> {
    const {
      page = PAGINATION_POSTS_DEFAULT.page,
      size = PAGINATION_POSTS_DEFAULT.size,
      sort = PAGINATION_POSTS_DEFAULT.sort,
    } = pagination;

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

    const posts = await this.postModel
      .find(query)
      .sort({ _id: sort === ESortOrderBy.DESC ? -1 : 1 })
      .populate('userId', '_id email firstName lastName username avatarURL city country');

    if (!posts) throw new NotFoundException(`Can't posts`);

    return {
      data: posts.slice((page - 1) * size, page * size),
      pagination: {
        page,
        size,
        sort,
        totalElements: posts.length,
        totalPages: Math.ceil(posts.length / size),
        lastPage: Number(page) === Math.ceil(posts.length / size),
      },
    };
  }

  async getUserPosts(userId, req) {
    const posts = await this.postModel.find({ userId });
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
