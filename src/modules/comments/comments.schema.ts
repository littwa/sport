import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { Customer, CustomerSchema } from 'src/customers/customers.schema'; // check how it works
import { IAddress, ICustomer, IDate, IOrderData } from 'src/shared/interfaces/prop.interfaces';
import { Product, ProductDocument } from 'src/products/products.schema';
import { User, UserDocument } from 'src/users/user.schema';

export type CommentDocument = Comment & Document;

@Schema()
export class Comment extends Document {
  @Prop({ type: String, required: true })
  text: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: false })
  answerTo: CommentDocument;

  @Prop({ type: String, default: new Date().toISOString() })
  created: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: UserDocument;

  @Prop({ type: Object, default: {} })
  likes: { [userId: string]: boolean };
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
