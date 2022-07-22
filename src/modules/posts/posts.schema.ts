import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { Customer, CustomerSchema } from 'src/customers/customers.schema'; // check how it works
import { IAddress, ICustomer, IDate, IOrderData } from 'src/shared/interfaces/prop.interfaces';
import { Product, ProductDocument } from 'src/products/products.schema';
import { User, UserDocument } from 'src/users/user.schema';

export type PostDocument = Post & Document;

@Schema()
export class Post extends Document {
  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: String, default: 'other', enum: ['war', 'sport', 'politics', 'economics', 'tech', 'music', 'other'] })
  title: string;

  @Prop({ type: String, default: '' })
  theme: string;

  @Prop({ type: String, default: new Date().toISOString() })
  created: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: UserDocument;

  @Prop({ type: Array, default: [], required: false })
  photoURLs: string[];

  @Prop({ type: Object, default: {} })
  likes: { [userId: string]: boolean };

  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' })
  // comments: CommentDocument;

  @Prop({ type: String, default: '' })
  deliveryDate: string;

  // @Prop({ type: Object, required: true })
  // ordered: IDate;

  //@Prop({ type: [CustomerSchema] })
  // productsList: ICustomer[]; //  Сheck how it works  ?????????
}

export const PostSchema = SchemaFactory.createForClass(Post);
