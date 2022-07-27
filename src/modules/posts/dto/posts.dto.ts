import { IsArray, IsIn, IsOptional, IsString, Length } from 'class-validator';
import { EPostsGet } from '../../../shared/enums/posts.enum';

export class CreatePostsDto {
  @IsString()
  readonly content: string;

  @IsString()
  @IsIn(['war', 'sport', 'politics', 'economics', 'tech', 'music', 'other'])
  readonly theme: string;

  @IsString()
  @IsOptional()
  readonly title: string;

  @IsArray()
  @IsOptional()
  readonly photoURLs: string[];
}

export class UpdatePostDto extends CreatePostsDto {
  @IsString()
  @IsOptional()
  readonly content: string;

  @IsString()
  @IsOptional()
  @IsIn(['war', 'sport', 'politics', 'economics', 'tech', 'music', 'other'])
  readonly theme: string;

  // @IsString()
  // @IsOptional()
  // readonly title: string;
  //
  // @IsArray()
  // @IsOptional()
  // readonly photoURLs: string[];
}

export class PostIdDto {
  @IsString()
  @Length(24, 24)
  readonly postId: string;
}

export class PostGetParamDto {
  @IsString()
  @IsIn([EPostsGet.Me, EPostsGet.Followers, EPostsGet.Following, EPostsGet.All])
  readonly whose: EPostsGet;
}

export class LikePostDto {
  readonly [userID: string]: boolean;
}
