import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { Customer, CustomerSchema } from 'src/customers/customers.schema'; // check how it works
import { ICustomer, IDate } from 'src/shared/interfaces/prop.interfaces';
import { Product } from 'src/products/products.schema';

// export type OrderDocument = Doc & Document;

@Schema()
export class Doc extends Document {
  @Prop({ type: String, required: true })
  docNo: string;

  @Prop({ type: String, default: '' })
  items: string;

  @Prop({ type: String, required: true })
  notes: string;

  @Prop({
    type: String,
    default: 'new',
    enum: ['new', 'verify', 'archive'],
  })
  status: string;

  @Prop({ type: Object, required: true })
  created: IDate;

  // @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }] })
  // productsList: Product[];

  //@Prop({ type: [CustomerSchema] })
  // productsList: ICustomer[]; //  Сheck how it works  ?????????
}

export const DocSchema = SchemaFactory.createForClass(Doc);
