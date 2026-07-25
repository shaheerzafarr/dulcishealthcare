import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity.js';
import { OrderItem } from './entities/order-item.entity.js';
import { OrderStatusHistory } from './entities/order-status-history.entity.js';
import { Payment } from './entities/payment.entity.js';
import { Transaction } from './entities/transaction.entity.js';
import { Invoice } from './entities/invoice.entity.js';
import { ReturnRequest } from './entities/return-request.entity.js';
import { Refund } from './entities/refund.entity.js';
import { OrdersService } from './orders.service.js';
import { OrdersController } from './orders.controller.js';
import { ProductsModule } from '../products/products.module.js';
import { ShippingModule } from '../shipping/shipping.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      OrderStatusHistory,
      Payment,
      Transaction,
      Invoice,
      ReturnRequest,
      Refund,
    ]),
    forwardRef(() => ProductsModule),
    ShippingModule,
  ],
  providers: [OrdersService],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
