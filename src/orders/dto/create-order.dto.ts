import { Product } from 'src/products/products.schema';
import { EStatus } from 'src/shared/enums/role.enum';
import { IAddress, IDate, IOrderData } from 'src/shared/interfaces/prop.interfaces';
import {IsNumberString, IsString} from "class-validator";

export class CreateOrderDto {
  readonly productsList: string[];
  readonly notes: string;
  readonly total: number;
  readonly deliveryAddress: IAddress;
  readonly contactData: IOrderData;
  readonly deliveryDate: string;
  readonly created: string;
}

export class UpdateOrderDTO {
  @IsString()
  readonly orderNo: string;
}
