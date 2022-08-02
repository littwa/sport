import { IAddress, IDate, IOrderData } from 'src/shared/interfaces/prop.interfaces';
import { IsArray, IsIn, IsInt, IsObject, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EOrderStatus } from '../../../shared/enums/orders.enum';

export class OrderDto {
  @ApiProperty()
  @IsArray()
  readonly productsList: string[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly notes?: string;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  readonly total?: number;

  @ApiProperty()
  @IsObject()
  @IsOptional()
  readonly deliveryAddress?: IAddress;

  @ApiProperty()
  @IsObject()
  @IsOptional()
  readonly contactData?: IOrderData;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly deliveryDate?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  readonly created?: string;
}

export class UpdateOrderDto {
  @ApiProperty()
  @IsString()
  readonly orderNo: string;
}

export class GetOrderDto {
  // @IsOptional()
  // @Length(24, 24)
  @IsOptional()
  @ApiPropertyOptional({ type: String, maxLength: 24, minLength: 24 })
  readonly userId: string;
}

export class OrderIdDto {
  @ApiProperty()
  @IsString()
  @Length(24, 24)
  readonly orderId: string;
}

export class ChangeOrderStatusDto {
  @ApiProperty({ enum: ['new', 'canceled', 'in progress', 'delivered', 'completed'] })
  // @IsString()
  @IsIn(['new', 'canceled', 'in progress', 'delivered', 'completed'])
  readonly status: EOrderStatus;
}

export class ExecuteProductInOrderDto {
  @ApiProperty()
  @IsString()
  @Length(24, 24)
  readonly productId: string;
}
