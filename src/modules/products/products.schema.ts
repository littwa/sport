import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { ICharacteristics } from 'src/shared/interfaces/prop.interfaces';
import * as mongoose from 'mongoose';
import { ReviewDocument } from 'src/modules/reviews/reviews.schema';
import { ProductsCategoryEnum, ProductsSubCategoryEnum } from 'src/shared/enums/products.enum';
// import { Characteristics } from './dto/product.dto';

export type ProductDocument = Product & Document;

@Schema()
export class Product extends Document {
    @Prop({ type: String, required: true })
    code: string;

    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: String, required: true })
    brand: string;

    @Prop({ type: String, default: 'Other', enum: ProductsCategoryEnum })
    category: string;

    @Prop({ type: String, default: 'Other', enum: ProductsSubCategoryEnum })
    subCategory: string;

    @Prop({ type: String, default: 'pcs', enum: ['kg', 'box', 'pcs', 'm'] })
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

    @Prop({ type: Object, required: true })
    characteristics: ICharacteristics;

    @Prop({ type: Object, default: {} })
    rating: { [userId: string]: 1 | 2 | 3 | 4 | 5 };

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }] })
    reviews: ReviewDocument[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
