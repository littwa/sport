import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post('add')
  @HttpCode(HttpStatus.CREATED)
  createOrders(@Body() body) {
    return this.ordersService.createOrder(body);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  getOrders() {
    return this.ordersService.getOrders();
  }

  @Get('aggregate')
  @HttpCode(HttpStatus.OK)
  getOrdersAggregate() {
    return this.ordersService.getOrdersWithProducts();
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

  // @Patch("confirmed/:orderId")
  // @HttpCode(HttpStatus.OK)
  // changeOrderStatus(@Param() param) {
  //     return this.ordersService.changeStatusToConfirmed(param.orderId);
  // }
}
