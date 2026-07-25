import { CouponUsage } from './coupon-usage.entity.js';
export declare class Coupon {
    id: string;
    code: string;
    description: string;
    discountType: string;
    discountValue: number;
    minOrderAmount: number;
    maxDiscount: number;
    usageLimit: number;
    usagePerUser: number;
    timesUsed: number;
    applicableCategories: string[];
    applicableProducts: string[];
    startsAt: Date;
    expiresAt: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    usages: CouponUsage[];
}
