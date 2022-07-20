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
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post('add')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  createOrders(@Body() body, @Req() req) {
    return this.ordersService.createOrder(body, req);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  getOrdersAggregate(@Body() body) {
    return this.ordersService.getOrdersWithProducts(body);
  }

  @Patch('confirmed/:orderId')
  @HttpCode(HttpStatus.OK)
  changeOrderStatus(@Param() param, @Body() body) {
    return this.ordersService.changeOrderStatus(param.orderId, body.status);
  }

  @Patch('update/:orderId')
  @HttpCode(HttpStatus.OK)
  updateOrder(@Param() param, @Body() body) {
    return this.ordersService.updateOrder(param.orderId, body);
  }

  @Patch('add-product/:orderId')
  @HttpCode(HttpStatus.OK)
  addProductsToOrderProdList(@Body() body, @Param() param) {
    return this.ordersService.addProductsToOrder(body, param.orderId);
  }

  @Patch('del-product/:orderId')
  @HttpCode(HttpStatus.NO_CONTENT)
  delProductsFromOrderProdList(@Body() body, @Param() param) {
    return this.ordersService.removeProductsFromOrder(body, param.orderId);
  }
}
