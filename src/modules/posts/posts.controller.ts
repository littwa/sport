import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { AuthGuard } from '@nestjs/passport';
import { CreatePostsDto, LikePostDto, PostGetParamDto, PostIdDto, UpdatePostDto } from './dto/posts.dto';
import { Roles } from 'src/authorization/roles.decorator';
import { ERole } from 'src/shared/enums/role.enum';
import { CommentIdDto, CreateCommentDto, LikeCommentDto } from '../comments/dto/comments.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post('add')
  @UseGuards(AuthGuard('jwt'))
  @Roles([ERole.Admin, ERole.Customer])
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.CREATED)
  createPosts(@Body() body: CreatePostsDto, @Req() req) {
    return this.postsService.createPosts(body, req);
  }

  @Patch('update/:postId')
  @UseGuards(AuthGuard('jwt'))
  @Roles([ERole.Admin, ERole.Customer])
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updatePost(@Param() param, @Body() body: UpdatePostDto) {
    return this.postsService.updatePost(param.postId, body);
  }

  @Delete('delete/:postId')
  @UseGuards(AuthGuard('jwt'))
  @Roles([ERole.Admin, ERole.Customer])
  @HttpCode(HttpStatus.NO_CONTENT)
  deletePost(@Param() param: PostIdDto) {
    return this.postsService.deletePost(param.postId);
  }

  @Patch('like/:postId')
  @UseGuards(AuthGuard('jwt'))
  @Roles([ERole.Admin, ERole.Customer])
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.OK)
  setLikePost(@Param() param: PostIdDto, @Body() body: LikePostDto) {
    return this.postsService.setLikePost(param.postId, body);
  }

  @Patch('add-comment/:postId')
  @UseGuards(AuthGuard('jwt'))
  @Roles([ERole.Admin, ERole.Customer])
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.OK)
  addCommentToPost(@Body() body: CreateCommentDto, @Param() param: PostIdDto) {
    return this.postsService.addCommentToPost(param.postId, body);
  }

  @Patch('del-comment/:postId')
  @UseGuards(AuthGuard('jwt'))
  @Roles([ERole.Admin, ERole.Customer])
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.OK)
  delCommentFromPost(@Body() body: CommentIdDto, @Param() param: PostIdDto) {
    return this.postsService.deleteCommentFromPost(param.postId, body);
  }

  @Get(':whose')
  @UseGuards(AuthGuard('jwt'))
  @Roles([ERole.Admin, ERole.Customer])
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.OK)
  getPostsAggregate(@Param() param: PostGetParamDto, @Req() req) {
    return this.postsService.getPostsAggregate(param.whose, req);
  }

  @Get('test/:whose')
  @UseGuards(AuthGuard('jwt'))
  @Roles([ERole.Admin, ERole.Customer])
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.OK)
  getPostsAggTest(@Param() param: PostGetParamDto, @Req() req) {
    return this.postsService.getPostsAggTest(param.whose, req);
  }
}
