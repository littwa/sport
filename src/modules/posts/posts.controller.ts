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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { AuthGuard } from '@nestjs/passport';
import { PostsDto } from './dto/posts.dto';
import { Roles } from 'src/users/authorization/roles.decorator';
import { ERole } from 'src/shared/enums/role.enum';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post('add')
  @UseGuards(AuthGuard('jwt'))
  @Roles([ERole.Admin, ERole.Customer])
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.CREATED)
  createOrders(@Body() body: PostsDto, @Req() req) {
    // return this.postsService.createOrder(body, req);
  }

  // @Get()
  // @UseGuards(AuthGuard('jwt'))
  // @Roles([ERole.Admin, ERole.Customer])
  // @UsePipes(new ValidationPipe({ whitelist: true }))
  // @HttpCode(HttpStatus.OK)
  // getOrdersAggregate(@Body() body: GetOrderDto) {
  //   return this.ordersService.getOrdersWithProducts(body);
  // }
  //
  // @Patch('update/:orderId')
  // @UseGuards(AuthGuard('jwt'))
  // @Roles([ERole.Admin, ERole.Customer])
  // @HttpCode(HttpStatus.OK)
  // @UsePipes(new ValidationPipe({ whitelist: true }))
  // updateOrder(@Param() param, @Body() body: UpdateOrderDto) {
  //   return this.ordersService.updateOrder(param.orderId, body);
  // }
  //
  // @Delete('delete/:orderId')
  // @UseGuards(AuthGuard('jwt'))
  // @Roles([ERole.Admin, ERole.Customer])
  // @HttpCode(HttpStatus.NO_CONTENT)
  // deleteOrder(@Param() param: OrderIdDto) {
  //   return this.ordersService.deleteOrder(param.orderId);
  // }
  //
  // @Patch('change-status/:orderId')
  // @UseGuards(AuthGuard('jwt'))
  // @Roles([ERole.Admin, ERole.Customer])
  // @UsePipes(new ValidationPipe({ whitelist: true }))
  // @HttpCode(HttpStatus.OK)
  // changeOrderStatus(@Param() param: OrderIdDto, @Body() body: ChangeOrderStatusDto) {
  //   return this.ordersService.changeOrderStatus(param.orderId, body.status);
  // }
  //
  // @Patch('add-product/:orderId')
  // @UseGuards(AuthGuard('jwt'))
  // @Roles([ERole.Admin, ERole.Customer])
  // @UsePipes(new ValidationPipe({ whitelist: true }))
  // @HttpCode(HttpStatus.OK)
  // addProductsToOrderProdList(@Body() body: ExecuteProductInOrderDto, @Param() param: OrderIdDto) {
  //   return this.ordersService.addProductsToOrder(body, param.orderId);
  // }
  //
  // @Patch('del-product/:orderId')
  // @UseGuards(AuthGuard('jwt'))
  // @Roles([ERole.Admin, ERole.Customer])
  // @UsePipes(new ValidationPipe({ whitelist: true }))
  // @HttpCode(HttpStatus.OK)
  // delProductsFromOrderProdList(@Body() body: ExecuteProductInOrderDto, @Param() param: OrderIdDto) {
  //   return this.ordersService.removeProductsFromOrder(body, param.orderId);
  // }
}
