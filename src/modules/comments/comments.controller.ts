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
import { CommentsService } from './comments.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/authorization/roles.decorator';
import { ERole } from 'src/shared/enums/role.enum';
import { CommentIdDto, CreateCommentDto, LikeCommentDto, UpdateCommentDto } from './dto/comments.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
    constructor(private commentsService: CommentsService) {}

    @Post('add')
    @UseGuards(AuthGuard('jwt'))
    @Roles([ERole.Admin, ERole.Customer])
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @HttpCode(HttpStatus.CREATED)
    createComment(@Body() body: CreateCommentDto, @Req() req) {
        return this.commentsService.createComment(body, req);
    }

    @Patch('update/:commentId')
    @UseGuards(AuthGuard('jwt'))
    @Roles([ERole.Admin, ERole.Customer])
    @HttpCode(HttpStatus.OK)
    @UsePipes(new ValidationPipe({ whitelist: true }))
    updateComment(@Param() param: CommentIdDto, @Body() body: UpdateCommentDto) {
        return this.commentsService.updateComment(param.commentId, body);
    }

    @Delete('delete/:commentId')
    @UseGuards(AuthGuard('jwt'))
    @Roles([ERole.Admin, ERole.Customer])
    @HttpCode(HttpStatus.NO_CONTENT)
    deleteComment(@Param() param: CommentIdDto) {
        return this.commentsService.deleteComment(param.commentId);
    }

    @Patch('like/:commentId')
    @UseGuards(AuthGuard('jwt'))
    @Roles([ERole.Admin, ERole.Customer])
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @HttpCode(HttpStatus.OK)
    setLikeComment(@Param() param: CommentIdDto, @Body() body) {
        return this.commentsService.setLikeComment(param.commentId, body);
    }

    // @Get()
    // @UseGuards(AuthGuard('jwt'))
    // @Roles([ERole.Admin, ERole.Customer])
    // @UsePipes(new ValidationPipe({ whitelist: true }))
    // @HttpCode(HttpStatus.OK)
    // getCommentAggregate(@Body() body) {
    //   return this.commentsService.comments(body);
    // }
}
