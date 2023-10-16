import { Body, Controller, Delete, HttpCode, HttpStatus, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import {JwtAuthGuard} from "../../guards/jwt-auth.guard";

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
    constructor(private reviewsService: ReviewsService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    addReview(@Body() body, @Req() req) {
        return this.reviewsService.createReview(body, req);
    }

    @Delete(':reviewId')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    delReview(@Param() param) {
        return this.reviewsService.deleteReview(param.reviewId);
    }

    @Patch(':reviewId')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    editReview(@Param() param, @Body() body) {
        return this.reviewsService.editReview(body, param.reviewId);
    }

    @Patch('like/:reviewId')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    rateProduct(@Body() body, @Param() param) {
        return this.reviewsService.setLike(body, param.reviewId);
    }
}
