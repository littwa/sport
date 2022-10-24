import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Response,
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
import { IGetPostsBody } from '../../shared/interfaces/posts.interfaces';
import { IPagination } from '../../shared/interfaces/common.interfaces';
import { Response as ResponseExpress } from 'express';

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

  @Get('post/:postId')
  @UseGuards(AuthGuard('jwt'))
  @Roles([ERole.Admin, ERole.Customer])
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.OK)
  getPostById(@Param() param: PostIdDto) {
    return this.postsService.getPostById(param.postId);
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
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  setLikePost(@Param() param: PostIdDto, @Body() body: LikePostDto) {
    console.log(10000888, body);
    return this.postsService.setOrDelLikePost(param.postId, body); // setLikePost
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
  @Header('Access-Control-Expose-Headers', '*')
  async getPostsAggregate(
    @Response() res: ResponseExpress,
    @Query() query: IPagination,
    @Param() param: PostGetParamDto,
    @Req() req,
  ) {
    console.log('req==', req);
    const { data, pagination } = await this.postsService.getPostsAggregate(param.whose, req, query);
    return res.set(pagination).json(data);
  }

  // export interface IPage<T> {
  //   content: T;
  //   empty: boolean;
  //   first:	boolean;
  //   last:	boolean;
  //   number: number;
  //   numberOfElements: number;
  //   pageable: IPageable;
  //   size: number;
  //   sort: ISort;
  //   totalElements: number;
  //   totalPages: number;
  // }

  @Get('test/:whose')
  @UseGuards(AuthGuard('jwt'))
  @Roles([ERole.Admin, ERole.Customer])
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.OK)
  getPostsAggTest(@Param() param: PostGetParamDto, @Req() req) {
    return this.postsService.getPostsAggTest(param.whose, req);
  }
}
