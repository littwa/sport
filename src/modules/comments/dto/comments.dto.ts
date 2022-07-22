import { IsObject, IsOptional, IsString, Length } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  text: string;

  @IsString()
  @Length(24, 24)
  answerTo: string;

  @IsString()
  @Length(24, 24)
  userId: string;
}

export class UpdateCommentDto {
  @IsString()
  text: string;
}

export class LikeCommentDto {
  @IsObject()
  likes: { [userId: string]: boolean };
}

export class CommentIdDto {
  @IsString()
  @Length(24, 24)
  readonly commentId: string;
}
