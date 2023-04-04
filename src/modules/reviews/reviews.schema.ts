import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import * as mongoose from 'mongoose';
import { Customer, CustomerSchema } from 'src/modules/customers/customers.schema'; // check how it works
import { ICustomer, IDate } from 'src/shared/interfaces/prop.interfaces';
import { Product } from 'src/modules/products/products.schema';
import { User } from 'src/modules/users/user.schema';

export type ReviewDocument = Review & Document;

@Schema()
export class Review extends Document {
    @Prop({ type: String, required: true })
    review: string;

    @Prop({ type: String, default: Date.now() })
    dateCreated: Date;

    @Prop({ type: Array, default: [] })
    tags: string[];

    @Prop({ type: Object, default: {} })
    likes: { [userId: string]: boolean };

    @Prop({ type: String, required: false })
    userAvatarURL: string;

    @Prop({ type: String, default: new Date().toISOString() })
    created: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product' })
    product: Product;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user: User;

    //@Prop({ type: [CustomerSchema] })
    // productsList: ICustomer[]; //  Сheck how it works  ?????????
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
