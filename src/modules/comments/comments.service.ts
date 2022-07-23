import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCommentDto, LikeCommentDto, UpdateCommentDto } from 'src/modules/comments/dto/comments.dto';
import { CommentDocument } from 'src/modules/comments/comments.schema';
import { Comment } from 'src/modules/comments/comments.schema';

@Injectable()
export class CommentsService {
  constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>) {}

  async createComment(createCommentDto: CreateCommentDto, req) {
    const newComment = await this.commentModel.create({
      ...createCommentDto,
      userId: req.user._id,
    });

    if (!newComment) throw new NotFoundException(`Can't create Comment`);
    return newComment;
  }

  async updateComment(commentId, updateCommentDto: UpdateCommentDto) {
    console.log(10000444, updateCommentDto);
    const updatedComment = await this.commentModel.findByIdAndUpdate(
      commentId,
      {
        $set: {
          text: updateCommentDto.text,
        },
      },
      { new: true, useFindAndModify: false },
    );

    if (!updatedComment) throw new NotFoundException(`Can't updated Comment`);
    return updatedComment;
  }

  async deleteComment(commentId: string) {
    const deletedComment = await this.commentModel.findByIdAndDelete(commentId);
    if (!deletedComment) throw new NotFoundException(`Can't del comment`);
    console.log(100005, deletedComment);
    // return `Customer ById: ${deletedComment} has been successfully deleted!`;
  }

  async setLikeComment(commentId: string, like: LikeCommentDto) {
    console.log(1111, commentId, like);
    const [keyUserId, valueLike] = Object.entries(like)[0];

    const likedComment = this.commentModel.findByIdAndUpdate(
      commentId,
      {
        $set: { [`likes.${keyUserId}`]: valueLike },
      },
      {
        new: true,
        useFindAndModify: false,
      },
    );

    return likedComment;
  }
}
