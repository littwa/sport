import { Product } from 'src/products/products.schema';
import { EStatus } from 'src/shared/enums/role.enum';
import { IAddress, IDate, IOrderData } from 'src/shared/interfaces/prop.interfaces';
import { IsArray, IsIn, IsInt, IsObject, IsOptional, IsString, Length } from 'class-validator';

export class CreateOrderDto {
  @IsArray()
  readonly productsList: string[];

  @IsString()
  @IsOptional()
  readonly notes?: string;

  @IsInt()
  @IsOptional()
  readonly total?: number;

  @IsObject()
  @IsOptional()
  readonly deliveryAddress?: IAddress;

  @IsObject()
  @IsOptional()
  readonly contactData?: IOrderData;

  @IsString()
  @IsOptional()
  readonly deliveryDate?: string;

  @IsString()
  @IsOptional()
  readonly created?: string;
}

export class UpdateOrderDto {
  @IsString()
  readonly orderNo: string;
}

export class GetOrderDto {
  @IsString()
  @Length(24, 24)
  readonly userId: string;
}

export class OrderIdDto {
  @IsString()
  @Length(24, 24)
  readonly orderId: string;
}

export class ChangeOrderStatusDto {
  @IsString()
  @IsIn(['new', 'canceled', 'in progress', 'delivered', 'completed'])
  readonly status: string;
}

export class ExecuteProductInOrderDto {
  @IsString()
  @Length(24, 24)
  readonly productId: string;
}
