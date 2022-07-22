import { IsObject, IsString, Length } from 'class-validator';

export class CommentDto {
  @IsString()
  text: string;

  @IsString()
  @Length(24, 24)
  answerTo: string;

  @IsString()
  created: string;

  @IsString()
  @Length(24, 24)
  userId: string;

  @IsObject()
  likes: { [userId: string]: boolean };
}
