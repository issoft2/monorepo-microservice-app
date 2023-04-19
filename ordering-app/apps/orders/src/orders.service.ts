import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { BILLING_SERVICE } from './constants/services';
import { CreateOrderRequest } from './dto/create-order.request';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  // inject the ordersRepository
  // persiste request in the database
  constructor(private readonly ordersRespository: OrdersRepository, 
    @Inject(BILLING_SERVICE) private billingClient: ClientProxy,
    ) {}

  // create a post
  async createOrder(request: CreateOrderRequest) {
    const session = await this.ordersRespository.startTransaction();
    try{
      const order  = await this.ordersRespository.create(request, { session });
      await lastValueFrom(
        this.billingClient.emit('order_created', {
          request,
        }),
      );
        await session.commitTransaction(); 
        return order;
    }catch(err){
      await session.abortTransaction();
      throw err;
    }
  }

  // get lists of orders
  async getOrders(){
    return this.ordersRespository.find({});
  }
}
