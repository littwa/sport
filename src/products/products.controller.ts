import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus, Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject('ProductsServiceToken') private productsService: ProductsService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getProducts() {
    return this.productsService.getProducts();
  }

  @Post('/add')
  @HttpCode(HttpStatus.CREATED)
  addProduct(@Body() body) {
    return this.productsService.addProduct(body);
  }

  @Patch('update/:productId')
  @HttpCode(HttpStatus.OK)
  updateProduct(@Body() body, @Param() param) {
    return this.productsService.updateProduct(body, param.productId);
  }

  @Delete('del/:productId')
  @HttpCode(HttpStatus.NO_CONTENT)
  delProduct(@Param() param) {
    return this.productsService.deleteProduct(param.productId);
  }

  @Get('test')
  @HttpCode(HttpStatus.OK)
  testProducts() {
    return { testProducts: true };
  }
}
