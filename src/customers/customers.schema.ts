import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { DeliveryDays } from 'src/shared/interfaces/prop.interfaces';

export type CustomerDocument = Customer & Document;

@Schema()
export class Customer extends Document {
    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: String, required: true, })
    customerNo: string;

    @Prop({ type: Object, required: true })
    deliveryDays: DeliveryDays;

    @Prop({ type: String, default: '' })
    shortlistedProducts: string;

    @Prop({ type: String, required: true })
    deliveryAddress: string;

    @Prop({ type: String, required: true })
    contactName: string;

    @Prop({ type: String, required: true })
    mobilePhone: string;

    @Prop({ type: Boolean, required: true })
    notifyCustomerMessage: boolean;

}

export const CustomerSchema = SchemaFactory.createForClass(Customer);

