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
  UseGuards,
} from '@nestjs/common';
import { TesterService } from './tester.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('tester')
@Controller('tester')
export class TesterController {
  constructor(private testerService: TesterService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getProducts() {
    return this.testerService.getTester();
  }
  //
  // @Post('/add')
  // @HttpCode(HttpStatus.CREATED)
  // addProduct(@Body() body) {
  //   return this.productsService.addProduct(body);
  // }
  //
  // @Patch('update/:productId')
  // @HttpCode(HttpStatus.OK)
  // updateProduct(@Body() body, @Param() param) {
  //   return this.productsService.updateProduct(body, param.productId);
  // }
  //
  // @Delete('del/:productId')
  // @HttpCode(HttpStatus.NO_CONTENT)
  // delProduct(@Param() param) {
  //   return this.productsService.deleteProduct(param.productId);
  // }
}
