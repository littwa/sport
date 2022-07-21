import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, ObjectId } from 'mongoose';
import { Product, ProductDocument } from 'src/products/products.schema';
import { EOrderStatus } from 'src/shared/enums/props.enum';
import { Order, OrderDocument } from './orders.schema';
import { CreateOrderDto, GetOrderDto, OrderIdDto, UpdateOrderDto } from './dto/create-order.dto';
import * as mongoose from 'mongoose';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto, req) {
    const newOrder = await this.orderModel.create({
      ...createOrderDto,
      userId: req.user._id,
    });

    if (!newOrder) throw new NotFoundException(`Can't create order`);
    return newOrder;
  }

  async getOrdersWithProducts(body: GetOrderDto) {
    console.log(100000222, body.userId);
    const aggregate = await this.orderModel
      .find(body.userId ? { userId: body.userId } : {})
      .populate('userId')
      .populate('productsList');
    if (!aggregate) throw new NotFoundException(`Can't aggregate orders`);
    return aggregate;
  }

  // async getOrders() {
  //   const allOrders = await this.orderModel.find();
  //   if (!allOrders) throw new NotFoundException(`Can't allOrders`);
  //   return allOrders;
  // }

  async changeOrderStatus(orderId, status) {
    const updatedOrder: any = await this.orderModel.findByIdAndUpdate(
      orderId,
      {
        $set: { status },
      },
      {
        new: true,
        useFindAndModify: false,
      },
    );

    if (!updatedOrder) throw new NotFoundException(`Can't change status order id:${orderId}`);
    return updatedOrder;
  }

  async updateOrder(orderId, updatedOrderDto: UpdateOrderDto) {
    console.log(10000444, updatedOrderDto);
    const updatedOrder = await this.orderModel.findByIdAndUpdate(
      orderId,
      {
        $set: {
          ...updatedOrderDto,
          // customerId: Types.ObjectId(updatedOrderDto.customerId),
          // productsList: updatedOrderDto.productsList.map((id: string) => Types.ObjectId(id))
        },
      },
      { new: true, useFindAndModify: false },
    );

    if (!updatedOrder) throw new NotFoundException(`Can't updated order`);
    return updatedOrder;
  }

  async deleteOrder(orderId: string) {
    const deletedOrder = await this.orderModel.findByIdAndDelete(orderId);
    if (!deletedOrder) throw new NotFoundException(`Can't del customer`);
    console.log(100005, deletedOrder);
    // return `Customer ById: ${orderId} has been successfully deleted!`;
  }

  async addProductsToOrder(body, orderId) {
    const product = await this.productModel.findById(body.productId);
    console.log(product);
    if (!product) throw new NotFoundException(`Can't find products for in this order`);

    const updatedUser = await this.orderModel.findByIdAndUpdate(
      orderId,
      {
        $push: { productsList: body.productId },
      },
      { new: true },
    );

    console.log(product);

    if (!updatedUser) throw new NotFoundException(`Can't add products in this order`);

    return updatedUser;
  }

  async removeProductsFromOrder(body, orderId) {
    const product = await this.productModel.findById(body.productId);
    console.log(product);
    if (!product) throw new NotFoundException(`Can't find products for for in this order`);

    const updatedUser = await this.orderModel.findByIdAndUpdate(
      orderId,
      {
        $pull: { productsList: body.productId },
      },
      { new: true },
    );

    return updatedUser;
  }
}
