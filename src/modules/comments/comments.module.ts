import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentSchema, Comment } from './comments.schema';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }])],
    controllers: [CommentsController],
    providers: [CommentsService],
    exports: [CommentsService, MongooseModule],
})
export class CommentsModule {}
