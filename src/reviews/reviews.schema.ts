import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { Customer, CustomerSchema } from 'src/customers/customers.schema'; // check how it works
import { ICustomer, IDate } from 'src/shared/interfaces/prop.interfaces';
import { Product } from 'src/products/products.schema';

export type ReviewDocument = Review & Document;

@Schema()
export class Review extends Document {
  @Prop({ type: String, required: true })
  review: string;

  @Prop({ type: String, default: Date.now() })
  dateCreated: Date;

  @Prop({ type: Array, default: [] })
  tags: string[];

  @Prop({ type: Array, default: [] })
  likes: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  userId: string;

  @Prop({ type: String, required: false })
  userAvatarURL: string;

  // @Prop({ type: Object, required: true })
  // created: IDate;

  // @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }] })
  // productsList: Product[];

  //@Prop({ type: [CustomerSchema] })
  // productsList: ICustomer[]; //  Сheck how it works  ?????????
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
