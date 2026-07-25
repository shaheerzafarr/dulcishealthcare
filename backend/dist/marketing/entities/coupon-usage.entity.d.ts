import { Coupon } from './coupon.entity.js';
import { User } from '../../users/entities/user.entity.js';
import { Order } from '../../orders/entities/order.entity.js';
export declare class CouponUsage {
    id: string;
    couponId: string;
    coupon: Coupon;
    userId: string;
    user: User;
    orderId: string;
    order: Order;
    discountApplied: number;
    usedAt: Date;
}
