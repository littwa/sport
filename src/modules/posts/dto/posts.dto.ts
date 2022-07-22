import { Product } from 'src/products/products.schema';
import { EStatus } from 'src/shared/enums/role.enum';
import { IAddress, IDate, IOrderData } from 'src/shared/interfaces/prop.interfaces';
import { IsArray, IsIn, IsInt, IsObject, IsOptional, IsString, Length } from 'class-validator';
import {Prop} from "@nestjs/mongoose";
import mongoose from "mongoose";
import { UserDocument } from "../../../users/user.schema";

export class PostsDto {
  @IsString()
  readonly content: string;

  @IsString()
  @IsOptional()
  readonly title: string;

  @IsString()
  @IsOptional()
  readonly theme: string; // ['war', 'sport', 'politics', 'economics', 'tech', 'music', 'other']

  @IsString()
  readonly userId: string;

  @IsArray()
  @IsOptional()
  readonly photoURLs: string[];
}

// export class UpdateOrderDto {
//   @IsString()
//   readonly orderNo: string;
// }
//
// export class GetOrderDto {
//   @IsString()
//   @Length(24, 24)
//   readonly userId: string;
// }
//
// export class OrderIdDto {
//   @IsString()
//   @Length(24, 24)
//   readonly orderId: string;
// }
//
// export class ChangeOrderStatusDto {
//   @IsString()
//   @IsIn(['new', 'canceled', 'in progress', 'delivered', 'completed'])
//   readonly status: string;
// }
//
// export class ExecuteProductInOrderDto {
//   @IsString()
//   @Length(24, 24)
//   readonly productId: string;
// }

