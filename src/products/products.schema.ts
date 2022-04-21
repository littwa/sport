import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IPrice } from 'src/shared/interfaces/prop.interfaces';

export type ProductDocument = Product & Document;

@Schema()
export class Product extends Document {
  @Prop({ type: String, required: true })
  productCode: string;

  @Prop({ type: String, required: true })
  product: string;

  @Prop({ type: String, default: 'pcs', enum: ['kg', 'box', 'pcs'] })
  unit: string;

  @Prop({ type: Object, required: true })
  price: IPrice;

  @Prop({ type: String, default: '99' })
  quantity: string;

  @Prop({ type: String, required: true })
  availability: string;

  @Prop({ type: String, default: 'customerNo...' })
  exclusively: string;

  @Prop({ type: String, default: 'Replacement Products...' })
  replacementProducts: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
