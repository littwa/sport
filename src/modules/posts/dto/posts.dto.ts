import {IsArray, IsIn, IsObject, IsOptional, IsString, Length} from 'class-validator';

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
  @IsIn(['me', 'followers', 'following', 'all', 'followers&following'])
  readonly whose: string;
}

export class LikePostDto {
  readonly [userID: string]: boolean;
}

//
// export class GetOrderDto {
//   @IsString()
//   @Length(24, 24)
//   readonly userId: string;
// }

//
// export class ChangeOrderStatusDto {
//   @IsString()
//   @IsIn(['new', 'canceled', 'in progress', 'delivered', 'completed'])
//   readonly status: string;
// }
//
// export class ExecuteProductInOrderDto {
//   @IsString()
//   @Length(24, 24)
//   readonly productId: string;
// }

