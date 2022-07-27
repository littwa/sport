import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { Customer, CustomerSchema } from 'src/modules/customers/customers.schema'; // check how it works
import { IAddress, ICustomer, IDate, IOrderData } from 'src/shared/interfaces/prop.interfaces';
import { Product, ProductDocument } from 'src/products/products.schema';
import { User, UserDocument } from 'src/users/user.schema';

export type OrderDocument = Order & Document;

@Schema()
export class Order extends Document {
  @Prop({ type: String, default: Date.now() })
  orderNo: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: UserDocument;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }] })
  productsList: ProductDocument[];

  @Prop({ type: String, default: '' })
  notes: string;

  @Prop({ type: Number, default: 0 })
  total: string;

  @Prop({ type: Object, default: {} })
  deliveryAddress: IAddress;

  @Prop({ type: Object, default: {} })
  contactData: IOrderData;

  @Prop({ type: String, default: '' })
  deliveryDate: string;

  @Prop({ type: String, default: new Date().toISOString() })
  created: string;

  @Prop({
    type: String,
    default: 'new',
    enum: ['new', 'canceled', 'in progress', 'delivered', 'completed'],
  })
  status: string;

  // @Prop({ type: Object, required: true })
  // ordered: IDate;

  //@Prop({ type: [CustomerSchema] })
  // productsList: ICustomer[]; //  Сheck how it works  ?????????
}

export const OrderSchema = SchemaFactory.createForClass(Order);
