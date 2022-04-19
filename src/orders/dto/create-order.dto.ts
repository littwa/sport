import { Product } from "src/products/products.schema";
import { EStatus } from "src/shared/enums/role.enum";
import { IDate } from "src/shared/interfaces/prop.interfaces";

export class createOrderDto {
    readonly orderNo: string;
    readonly customerId: string;
    readonly customer: string;
    readonly customerNo: string;
    readonly items: string;
    readonly notes: string;
    readonly status: EStatus;
    readonly ordered: IDate;
    readonly reqDelivery: IDate;
    readonly productsList: string[];
}