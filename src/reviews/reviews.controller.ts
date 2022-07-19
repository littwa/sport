import {Body, Controller, Delete, HttpCode, HttpStatus, Param, Post, Req, UseGuards} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  addReview(@Body() body, @Req() req) {
    return this.reviewsService.createReview(body, req);
  }

  @Delete(':reviewId')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  delReview(@Param() param) {
    return this.reviewsService.deleteReview(param.reviewId);
  }
}
