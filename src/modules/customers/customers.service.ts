import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer, CustomerDocument } from './customers.schema';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Injectable()
export class CustomersService {
    constructor(@InjectModel(Customer.name) private customerModel: Model<CustomerDocument>) {}

    async getCustomers() {
        const allCustomers = await this.customerModel.find();
        if (allCustomers.length === 0) throw new NotFoundException(`Can't get all customers`);
        return allCustomers;
    }

    async createCustomer(createCustomerDto: CreateCustomerDto) {
        const newCustomer = await this.customerModel.create({
            ...createCustomerDto,
        });

        if (!newCustomer) throw new NotFoundException(`Can't create customer`);
        return newCustomer;
    }

    async updateCustomer(updatedCustomerDto, customerId) {
        const updatedCustomer = await this.customerModel.findByIdAndUpdate(
            customerId,
            { $set: updatedCustomerDto },
            { new: true, useFindAndModify: false },
        );

        if (!updatedCustomer) throw new NotFoundException(`Can't updated customer`);
        return updatedCustomer;
    }

    async deleteCustomer(customerId) {
        const deletedCustomer = await this.customerModel.findByIdAndDelete(customerId);
        if (!deletedCustomer) throw new NotFoundException(`Can't del customer`);
        return `Customer ById: ${customerId} has been successfully deleted!`;
    }
}
