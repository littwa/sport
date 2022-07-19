import { Product } from 'src/products/products.schema';
import { EStatus } from 'src/shared/enums/role.enum';
import { IAddress, IDate, IOrderData } from 'src/shared/interfaces/prop.interfaces';

export class CreateOrderDto {
  readonly productsList: string[];
  readonly notes: string;
  readonly total: number;
  readonly deliveryAddress: IAddress;
  readonly contactData: IOrderData;
  readonly deliveryDate: string;
  readonly created: string;
}
