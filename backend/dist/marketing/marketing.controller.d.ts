import { JwtService } from '@nestjs/jwt';
import { MarketingService } from './marketing.service.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';
export declare class MarketingController {
    private readonly marketingService;
    private readonly jwtService;
    constructor(marketingService: MarketingService, jwtService: JwtService);
    validate(req: any, code: string, subtotal: number, productIds?: string[], categoryIds?: string[]): Promise<{
        coupon: import("./entities/coupon.entity.js").Coupon;
        discount: number;
    }>;
    subscribe(email: string, firstName?: string, source?: string): Promise<import("./entities/newsletter-subscriber.entity.js").NewsletterSubscriber>;
    unsubscribe(email: string): Promise<void>;
    adminGetCoupons(): Promise<import("./entities/coupon.entity.js").Coupon[]>;
    adminCreateCoupon(dto: any): Promise<import("./entities/coupon.entity.js").Coupon>;
    adminUpdateCoupon(id: string, dto: any): Promise<import("./entities/coupon.entity.js").Coupon>;
    adminDeleteCoupon(id: string): Promise<void>;
    adminGetDiscounts(): Promise<import("./entities/discount.entity.js").Discount[]>;
    adminCreateDiscount(dto: any): Promise<import("./entities/discount.entity.js").Discount>;
    adminUpdateDiscount(id: string, dto: any): Promise<import("./entities/discount.entity.js").Discount>;
    adminDeleteDiscount(id: string): Promise<void>;
    adminGetFlashSales(): Promise<import("./entities/flash-sale.entity.js").FlashSale[]>;
    adminCreateFlashSale(dto: any): Promise<import("./entities/flash-sale.entity.js").FlashSale>;
    adminUpdateFlashSale(id: string, dto: any): Promise<import("./entities/flash-sale.entity.js").FlashSale>;
    adminDeleteFlashSale(id: string): Promise<void>;
    adminGetSubscribers(paginationDto: PaginationDto): Promise<{
        subscribers: import("./entities/newsletter-subscriber.entity.js").NewsletterSubscriber[];
        total: number;
        page: number;
        limit: number;
    }>;
    adminGetAbandonedCarts(paginationDto: PaginationDto, unrecovered?: string): Promise<{
        carts: import("./entities/abandoned-cart.entity.js").AbandonedCart[];
        total: number;
        page: number;
        limit: number;
    }>;
    adminSendReminders(): Promise<any>;
}
