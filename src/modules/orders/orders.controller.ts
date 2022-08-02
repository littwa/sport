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
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ChangeOrderStatusDto,
  OrderDto,
  ExecuteProductInOrderDto,
  GetOrderDto,
  OrderIdDto,
  UpdateOrderDto,
} from './dto/order.dto';
import { Roles } from 'src/authorization/roles.decorator';
import { ERole } from 'src/shared/enums/role.enum';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Create order' })
  @ApiResponse({ status: 200, description: 'Return created order.' })
  @ApiResponse({ status: 404, description: 'Can not create order.' })
  @ApiBearerAuth()
  @Post('add')
  @UseGuards(AuthGuard('jwt'))
  @Roles([ERole.Admin, ERole.Customer])
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.CREATED)
  createOrders(@Body() body: OrderDto, @Req() req) {
    return this.ordersService.createOrder(body, req);
  }

  @ApiOperation({ summary: 'Get orders' })
  @ApiResponse({ status: 200, description: 'Return orders.' })
  @ApiResponse({ status: 404, description: 'Can not get orders.' })
  @ApiBearerAuth()
  @Get('/:userId?')
  @UseGuards(AuthGuard('jwt'))
  @Roles([ERole.Admin, ERole.Customer])
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.OK)
  getOrdersAggregate(@Param() param: GetOrderDto) {
    console.log(1299999, param);
    return this.ordersService.getOrdersWithProducts(param);
  }

  @ApiOperation({ summary: 'Update order' })
  @ApiResponse({ status: 200, description: 'Return updates order.' })
  @ApiResponse({ status: 404, description: 'Can not update order.' })
  @ApiBearerAuth()
  @Patch('update/:orderId')
  @UseGuards(AuthGuard('jwt'))
  @Roles([ERole.Admin, ERole.Customer])
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateOrder(@Param() param, @Body() body: UpdateOrderDto) {
    return this.ordersService.updateOrder(param.orderId, body);
  }

  @ApiOperation({ summary: 'Delete order' })
  @ApiResponse({ status: 204, description: 'Order delete.' })
  @ApiResponse({ status: 404, description: 'Can not delete order.' })
  @ApiBearerAuth()
  @Delete('delete/:orderId')
  @UseGuards(AuthGuard('jwt'))
  @Roles([ERole.Admin, ERole.Customer])
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteOrder(@Param() param: OrderIdDto) {
    return this.ordersService.deleteOrder(param.orderId);
  }

  @ApiOperation({ summary: 'Change order status' })
  @ApiResponse({ status: 200, description: 'Return changed status order.' })
  @ApiResponse({ status: 404, description: 'Can not changed status order.' })
  @ApiBearerAuth()
  @Patch('change-status/:orderId')
  @UseGuards(AuthGuard('jwt'))
  @Roles([ERole.Admin, ERole.Customer])
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.OK)
  changeOrderStatus(@Param() param: OrderIdDto, @Query() query: ChangeOrderStatusDto) {
    console.log(100004, query);
    return this.ordersService.changeOrderStatus(param.orderId, query.status);
  }

  @ApiOperation({ summary: 'Add product to order' })
  @ApiResponse({ status: 200, description: 'Return updates order.' })
  @ApiResponse({ status: 404, description: 'Can not update order.' })
  @ApiBearerAuth()
  @Patch('add-product/:orderId')
  @UseGuards(AuthGuard('jwt'))
  @Roles([ERole.Admin, ERole.Customer])
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.OK)
  addProductsToOrderProdList(@Body() body: ExecuteProductInOrderDto, @Param() param: OrderIdDto) {
    return this.ordersService.addProductsToOrder(body, param.orderId);
  }

  @ApiOperation({ summary: 'Del product from order' })
  @ApiResponse({ status: 200, description: 'Return updates order.' })
  @ApiResponse({ status: 404, description: 'Can not update order.' })
  @ApiBearerAuth()
  @Patch('del-product/:orderId')
  @UseGuards(AuthGuard('jwt'))
  @Roles([ERole.Admin, ERole.Customer])
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.OK)
  delProductsFromOrderProdList(@Body() body: ExecuteProductInOrderDto, @Param() param: OrderIdDto) {
    return this.ordersService.removeProductsFromOrder(body, param.orderId);
  }
}
