import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from 'src/products/products.module';
import { CommentSchema, Comment } from './comments.schema';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
// import { ProductsService } from 'src/products/products.service';
// import { CommentsController } from './posts.controller';
// import { Post, PostSchema } from './posts.schema';
// import { CommentsService } from './posts.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    // ProductsModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
