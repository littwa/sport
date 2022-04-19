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
} from '@nestjs/common';
import { CustomersService } from './customers.service';

@Controller('customers')
export class CustomersController {
  constructor(private customersService: CustomersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAllCustomers() {
    return this.customersService.getCustomers();
  }

  @Post('add')
  @HttpCode(HttpStatus.CREATED)
  addCustomer(@Body() body) {
    return this.customersService.createCustomer(body);
  }

  @Patch('update/:customerId')
  @HttpCode(HttpStatus.OK)
  updateCustomer(@Body() body, @Param() param) {
    return this.customersService.updateCustomer(body, param.customerId);
  }

  @Delete('del/:customerId')
  @HttpCode(HttpStatus.NO_CONTENT)
  delCustomer(@Param() param) {
    return this.customersService.deleteCustomer(param.customerId);
  }
}
