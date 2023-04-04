import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewDocument, Review, ReviewSchema } from './reviews.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }])],
    controllers: [ReviewsController],
    providers: [ReviewsService],
    // exports: [MongooseModule, ReviewsService],
})
export class ReviewsModule {}
