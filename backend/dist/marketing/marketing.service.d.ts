import { Repository } from 'typeorm';
import { Coupon } from './entities/coupon.entity.js';
import { CouponUsage } from './entities/coupon-usage.entity.js';
import { Discount } from './entities/discount.entity.js';
import { FlashSale } from './entities/flash-sale.entity.js';
import { NewsletterSubscriber } from './entities/newsletter-subscriber.entity.js';
import { AbandonedCart } from './entities/abandoned-cart.entity.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';
export declare class MarketingService {
    private couponRepo;
    private usageRepo;
    private discountRepo;
    private saleRepo;
    private subscriberRepo;
    private abandonedRepo;
    constructor(couponRepo: Repository<Coupon>, usageRepo: Repository<CouponUsage>, discountRepo: Repository<Discount>, saleRepo: Repository<FlashSale>, subscriberRepo: Repository<NewsletterSubscriber>, abandonedRepo: Repository<AbandonedCart>);
    validateCoupon(code: string, userId: string, subtotal: number, itemProductIds?: string[], itemCategoryIds?: string[]): Promise<{
        coupon: Coupon;
        discount: number;
    }>;
    trackCouponUsage(couponId: string, userId: string, orderId: string, discountApplied: number): Promise<CouponUsage>;
    findAllCoupons(): Promise<Coupon[]>;
    findCouponById(id: string): Promise<Coupon>;
    createCoupon(dto: any): Promise<Coupon>;
    updateCoupon(id: string, dto: any): Promise<Coupon>;
    deleteCoupon(id: string): Promise<void>;
    findAllDiscounts(): Promise<Discount[]>;
    createDiscount(dto: any): Promise<Discount>;
    updateDiscount(id: string, dto: any): Promise<Discount>;
    deleteDiscount(id: string): Promise<void>;
    findAllFlashSales(): Promise<FlashSale[]>;
    createFlashSale(dto: any): Promise<FlashSale>;
    updateFlashSale(id: string, dto: any): Promise<FlashSale>;
    deleteFlashSale(id: string): Promise<void>;
    subscribeNewsletter(email: string, firstName?: string, source?: string): Promise<NewsletterSubscriber>;
    unsubscribeNewsletter(email: string): Promise<void>;
    findAllSubscribers(paginationDto: PaginationDto): Promise<{
        subscribers: NewsletterSubscriber[];
        total: number;
        page: number;
        limit: number;
    }>;
    logAbandonedCart(userId: string | null, email: string, cartData: any, total: number): Promise<AbandonedCart>;
    markCartRecovered(email: string, orderId: string): Promise<void>;
    findAllAbandonedCarts(paginationDto: PaginationDto, unrecoveredOnly?: boolean): Promise<{
        carts: AbandonedCart[];
        total: number;
        page: number;
        limit: number;
    }>;
    triggerRecoveryEmails(): Promise<any>;
}
