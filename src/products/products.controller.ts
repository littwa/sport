import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('products')
export class ProductsController {
  constructor(@Inject('ProductsServiceToken') private productsService: ProductsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getProducts() {
    return this.productsService.getProducts();
  }

  @Get(':productId')
  @HttpCode(HttpStatus.OK)
  getProductById(@Param() param) {
    return this.productsService.getProductById(param.productId);
  }

  @Post('add')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  addProduct(@Body() body) {
    return this.productsService.addProduct(body);
  }

  @Patch('update/:productId')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  updateProduct(@Body() body, @Param() param) {
    return this.productsService.updateProduct(body, param.productId);
  }

  @Delete('del/:productId')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  delProduct(@Param() param) {
    return this.productsService.deleteProduct(param.productId);
  }

  @Patch('rate/:productId')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  rateProduct(@Body() body, @Param() param) {
    return this.productsService.giveRatingProduct(body, param.productId);
  }

  @Get('test')
  @HttpCode(HttpStatus.OK)
  testProducts() {
    return { testProducts: true };
  }

  // @Put('update/:productId')
  // @HttpCode(HttpStatus.OK)
  // updateProductPut(@Body() body, @Param() param) {
  //   return this.productsService.updateProduct(body, param.productId);
  // }
}
