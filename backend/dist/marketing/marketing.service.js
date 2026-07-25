"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const coupon_entity_js_1 = require("./entities/coupon.entity.js");
const coupon_usage_entity_js_1 = require("./entities/coupon-usage.entity.js");
const discount_entity_js_1 = require("./entities/discount.entity.js");
const flash_sale_entity_js_1 = require("./entities/flash-sale.entity.js");
const newsletter_subscriber_entity_js_1 = require("./entities/newsletter-subscriber.entity.js");
const abandoned_cart_entity_js_1 = require("./entities/abandoned-cart.entity.js");
let MarketingService = class MarketingService {
    couponRepo;
    usageRepo;
    discountRepo;
    saleRepo;
    subscriberRepo;
    abandonedRepo;
    constructor(couponRepo, usageRepo, discountRepo, saleRepo, subscriberRepo, abandonedRepo) {
        this.couponRepo = couponRepo;
        this.usageRepo = usageRepo;
        this.discountRepo = discountRepo;
        this.saleRepo = saleRepo;
        this.subscriberRepo = subscriberRepo;
        this.abandonedRepo = abandonedRepo;
    }
    async validateCoupon(code, userId, subtotal, itemProductIds = [], itemCategoryIds = []) {
        const cleanCode = code.toUpperCase().trim();
        const coupon = await this.couponRepo.findOne({ where: { code: cleanCode, isActive: true } });
        if (!coupon)
            throw new common_1.NotFoundException('Coupon code is invalid or inactive');
        const now = new Date();
        if (coupon.startsAt && now < coupon.startsAt) {
            throw new common_1.BadRequestException('Coupon promotion has not started yet');
        }
        if (coupon.expiresAt && now > coupon.expiresAt) {
            throw new common_1.BadRequestException('Coupon code has expired');
        }
        if (coupon.usageLimit && coupon.timesUsed >= coupon.usageLimit) {
            throw new common_1.BadRequestException('Coupon maximum usage limit has been reached');
        }
        if (userId) {
            const userClaims = await this.usageRepo.count({
                where: { couponId: coupon.id, userId },
            });
            if (userClaims >= coupon.usagePerUser) {
                throw new common_1.BadRequestException('You have already reached the maximum usage limit for this coupon');
            }
        }
        if (subtotal < Number(coupon.minOrderAmount)) {
            throw new common_1.BadRequestException(`Minimum purchase of PKR ${coupon.minOrderAmount} is required for this coupon`);
        }
        if (coupon.applicableProducts && coupon.applicableProducts.length > 0) {
            const match = itemProductIds.some((pid) => coupon.applicableProducts.includes(pid));
            if (!match) {
                throw new common_1.BadRequestException('This coupon code is not applicable to any products in your cart');
            }
        }
        if (coupon.applicableCategories && coupon.applicableCategories.length > 0) {
            const match = itemCategoryIds.some((cid) => coupon.applicableCategories.includes(cid));
            if (!match) {
                throw new common_1.BadRequestException('This coupon code is not applicable to any product categories in your cart');
            }
        }
        let discount = 0;
        if (coupon.discountType === 'fixed') {
            discount = Number(coupon.discountValue);
        }
        else if (coupon.discountType === 'percentage') {
            discount = subtotal * (Number(coupon.discountValue) / 100);
            if (coupon.maxDiscount && discount > Number(coupon.maxDiscount)) {
                discount = Number(coupon.maxDiscount);
            }
        }
        return { coupon, discount: Math.min(discount, subtotal) };
    }
    async trackCouponUsage(couponId, userId, orderId, discountApplied) {
        const coupon = await this.couponRepo.findOne({ where: { id: couponId } });
        if (!coupon)
            throw new common_1.NotFoundException('Coupon not found');
        const usage = this.usageRepo.create({
            couponId,
            userId,
            orderId,
            discountApplied,
        });
        const saved = await this.usageRepo.save(usage);
        coupon.timesUsed += 1;
        await this.couponRepo.save(coupon);
        return saved;
    }
    async findAllCoupons() {
        return this.couponRepo.find({ order: { code: 'ASC' } });
    }
    async findCouponById(id) {
        const coupon = await this.couponRepo.findOne({ where: { id } });
        if (!coupon)
            throw new common_1.NotFoundException('Coupon not found');
        return coupon;
    }
    async createCoupon(dto) {
        if (dto.code)
            dto.code = dto.code.toUpperCase().trim();
        const existing = await this.couponRepo.findOne({ where: { code: dto.code } });
        if (existing)
            throw new common_1.BadRequestException('Coupon code already exists');
        const coupon = this.couponRepo.create(dto);
        return this.couponRepo.save(coupon);
    }
    async updateCoupon(id, dto) {
        const coupon = await this.findCouponById(id);
        if (dto.code)
            dto.code = dto.code.toUpperCase().trim();
        Object.assign(coupon, dto);
        return this.couponRepo.save(coupon);
    }
    async deleteCoupon(id) {
        const coupon = await this.findCouponById(id);
        await this.couponRepo.remove(coupon);
    }
    async findAllDiscounts() {
        return this.discountRepo.find({ order: { createdAt: 'DESC' } });
    }
    async createDiscount(dto) {
        const discount = this.discountRepo.create(dto);
        return this.discountRepo.save(discount);
    }
    async updateDiscount(id, dto) {
        const disc = await this.discountRepo.findOne({ where: { id } });
        if (!disc)
            throw new common_1.NotFoundException('Discount rule not found');
        Object.assign(disc, dto);
        return this.discountRepo.save(disc);
    }
    async deleteDiscount(id) {
        const disc = await this.discountRepo.findOne({ where: { id } });
        if (!disc)
            throw new common_1.NotFoundException('Discount rule not found');
        await this.discountRepo.remove(disc);
    }
    async findAllFlashSales() {
        return this.saleRepo.find({ order: { startsAt: 'ASC' } });
    }
    async createFlashSale(dto) {
        const sale = this.saleRepo.create(dto);
        return this.saleRepo.save(sale);
    }
    async updateFlashSale(id, dto) {
        const sale = await this.saleRepo.findOne({ where: { id } });
        if (!sale)
            throw new common_1.NotFoundException('Flash sale not found');
        Object.assign(sale, dto);
        return this.saleRepo.save(sale);
    }
    async deleteFlashSale(id) {
        const sale = await this.saleRepo.findOne({ where: { id } });
        if (!sale)
            throw new common_1.NotFoundException('Flash sale not found');
        await this.saleRepo.remove(sale);
    }
    async subscribeNewsletter(email, firstName, source = 'website') {
        const cleanEmail = email.toLowerCase().trim();
        let sub = await this.subscriberRepo.findOne({ where: { email: cleanEmail } });
        if (sub) {
            if (sub.isActive)
                throw new common_1.BadRequestException('Email address is already subscribed');
            sub.isActive = true;
            sub.unsubscribedAt = null;
            if (firstName)
                sub.firstName = firstName;
            return this.subscriberRepo.save(sub);
        }
        sub = this.subscriberRepo.create({
            email: cleanEmail,
            firstName,
            source,
        });
        return this.subscriberRepo.save(sub);
    }
    async unsubscribeNewsletter(email) {
        const sub = await this.subscriberRepo.findOne({ where: { email: email.toLowerCase().trim() } });
        if (!sub)
            throw new common_1.NotFoundException('Subscriber not found');
        sub.isActive = false;
        sub.unsubscribedAt = new Date();
        await this.subscriberRepo.save(sub);
    }
    async findAllSubscribers(paginationDto) {
        const page = paginationDto.page || 1;
        const limit = paginationDto.limit || 10;
        const skip = (page - 1) * limit;
        const [subscribers, total] = await this.subscriberRepo.findAndCount({
            order: { subscribedAt: 'DESC' },
            take: limit,
            skip,
        });
        return {
            subscribers,
            total,
            page,
            limit,
        };
    }
    async logAbandonedCart(userId, email, cartData, total) {
        const cleanEmail = email.toLowerCase().trim();
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        let record = await this.abandonedRepo.findOne({
            where: { email: cleanEmail, recovered: false },
            order: { createdAt: 'DESC' },
        });
        if (record && record.createdAt > oneDayAgo) {
            record.cartData = cartData;
            record.cartTotal = total;
            record.abandonedAt = new Date();
            return this.abandonedRepo.save(record);
        }
        record = this.abandonedRepo.create({
            userId: userId || undefined,
            email: cleanEmail,
            cartData,
            cartTotal: total,
        });
        return this.abandonedRepo.save(record);
    }
    async markCartRecovered(email, orderId) {
        const cleanEmail = email.toLowerCase().trim();
        const records = await this.abandonedRepo.find({
            where: { email: cleanEmail, recovered: false },
        });
        for (const rec of records) {
            rec.recovered = true;
            rec.recoveredOrderId = orderId;
            await this.abandonedRepo.save(rec);
        }
    }
    async findAllAbandonedCarts(paginationDto, unrecoveredOnly = false) {
        const page = paginationDto.page || 1;
        const limit = paginationDto.limit || 10;
        const skip = (page - 1) * limit;
        const where = {};
        if (unrecoveredOnly)
            where.recovered = false;
        const [carts, total] = await this.abandonedRepo.findAndCount({
            where,
            order: { abandonedAt: 'DESC' },
            take: limit,
            skip,
        });
        return {
            carts,
            total,
            page,
            limit,
        };
    }
    async triggerRecoveryEmails() {
        const carts = await this.abandonedRepo.find({
            where: { recovered: false, recoveryEmailSent: false },
        });
        for (const cart of carts) {
            cart.recoveryEmailSent = true;
            cart.recoveryEmailSentAt = new Date();
            await this.abandonedRepo.save(cart);
        }
        return {
            triggeredCount: carts.length,
        };
    }
};
exports.MarketingService = MarketingService;
exports.MarketingService = MarketingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(coupon_entity_js_1.Coupon)),
    __param(1, (0, typeorm_1.InjectRepository)(coupon_usage_entity_js_1.CouponUsage)),
    __param(2, (0, typeorm_1.InjectRepository)(discount_entity_js_1.Discount)),
    __param(3, (0, typeorm_1.InjectRepository)(flash_sale_entity_js_1.FlashSale)),
    __param(4, (0, typeorm_1.InjectRepository)(newsletter_subscriber_entity_js_1.NewsletterSubscriber)),
    __param(5, (0, typeorm_1.InjectRepository)(abandoned_cart_entity_js_1.AbandonedCart)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], MarketingService);
//# sourceMappingURL=marketing.service.js.map