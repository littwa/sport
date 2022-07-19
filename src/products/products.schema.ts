import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { ICharacteristic, IPrice } from 'src/shared/interfaces/prop.interfaces';
import * as mongoose from 'mongoose';
import { UserDocument } from '../users/user.schema';
import { ReviewDocument } from '../reviews/reviews.schema';

export type ProductDocument = Product & Document;

@Schema()
export class Product extends Document {
  @Prop({ type: String, required: true })
  code: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, default: 'other' })
  category: string;

  @Prop({ type: String, default: 'pcs', enum: ['kg', 'box', 'pcs'] })
  unit: string;

  @Prop({ type: Number, default: 0 })
  price: number;

  @Prop({ type: Number, default: 0 })
  quantity: number;

  @Prop({ type: Boolean, default: true })
  availability: boolean;

  @Prop({ type: String, default: '' })
  info: string;

  @Prop({ type: String, default: '' })
  description: string;

  @Prop({ type: Array, default: [] })
  tags: string[];

  @Prop({ type: Array, default: [] })
  photos: string[];

  @Prop({ type: String, default: Date.now() })
  dateCreated: Date;

  @Prop({ type: Object, default: {} })
  characteristic: ICharacteristic;

  @Prop({ type: Object, default: {} })
  rating: { [userId: string]: 1 | 2 | 3 | 4 | 5 };

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }] })
  reviews: ReviewDocument[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
