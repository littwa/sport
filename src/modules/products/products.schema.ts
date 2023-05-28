import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import * as mongoose from 'mongoose';
import { ReviewDocument } from 'src/modules/reviews/reviews.schema';
import { EColor, EUnitWeight, ProductsCategoryEnum, ProductsSubCategoryEnum } from 'src/shared/enums/products.enum';
import { BRANDS } from '../../shared/constants/product.constants';
import { TCharacteristics } from 'src/shared/types/common.types';

@Schema({ _id: false })
export class Characteristics extends Document implements TCharacteristics {
    @Prop({ type: Number, required: true })
    weight: number;

    @Prop({ type: String, required: true, default: EUnitWeight.Kilogram, enum: Object.values(EUnitWeight) })
    weight_unit: EUnitWeight;

    @Prop({ type: String, required: true })
    size: string;

    @Prop({ type: String, required: true, enum: BRANDS.map(v => v.name) })
    brand: string;

    @Prop({ type: Number, required: true })
    price: number;

    @Prop({ type: String, enum: Object.values(EColor) })
    color: EColor;

    @Prop({ type: String })
    material: string;

    @Prop({ type: Number })
    year: number;

    @Prop({ type: String })
    additional_characteristic: string;

    @Prop({ type: Number })
    screen_diagonal: number;

    @Prop({ type: String })
    type_screen: string;

    @Prop({ type: Number })
    refresh_rate: number;

    @Prop({ type: Number })
    resolution: number;

    @Prop({ type: String })
    cpu: string;

    @Prop({ type: Number })
    amount_ram: number;

    @Prop({ type: String })
    type_ram: string;

    @Prop({ type: String })
    type_memory: string;

    @Prop({ type: Number })
    volume_memory: number;

    @Prop({ type: String })
    videocard: string;

    @Prop({ type: String })
    wifi: string;

    @Prop({ type: String })
    bluetooth: string;

    @Prop({ type: String })
    main_camera: string;

    @Prop({ type: String })
    front_camera: string;

    @Prop({ type: String })
    type_device: string;

    @Prop({ type: String })
    format: string;

    @Prop({ type: String })
    network_interfaces: string;

    @Prop({ type: String })
    type_console: string;
}
export const CharacteristicsSchema = SchemaFactory.createForClass(Characteristics);

export type ProductDocument = Product & Document;


@Schema()
export class Product extends Document {
    @Prop({ type: String, required: true })
    code: string;

    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: String, default: 'Other', enum: ProductsCategoryEnum })
    category: string;

    @Prop({ type: String, default: 'Other', enum: ProductsSubCategoryEnum })
    sub_category: string;

    @Prop({ type: String, default: 'pcs', enum: ['kg', 'box', 'pcs', 'm'] })
    unit: string;

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
    date_created: Date;

    @Prop({ type: Object, default: {} })
    rating: { [userId: string]: 1 | 2 | 3 | 4 | 5 };

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }] })
    reviews: ReviewDocument[];

    @Prop({ type: CharacteristicsSchema, required: true })
    characteristics: Characteristics;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
