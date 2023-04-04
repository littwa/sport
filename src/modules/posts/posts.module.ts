import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from 'src/modules/products/products.module';
// import { ProductsService } from 'src/products/products.service';
import { PostsController } from './posts.controller';
import { Post, PostSchema } from './posts.schema';
import { PostsService } from './posts.service';
import { CommentsModule } from '../comments/comments.module';

@Module({
    imports: [MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]), CommentsModule],
    controllers: [PostsController],
    providers: [PostsService],
    exports: [PostsService],
})
export class PostsModule {}
