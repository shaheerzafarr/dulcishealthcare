import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial, In } from 'typeorm';
import { Coupon } from './entities/coupon.entity.js';
import { CouponUsage } from './entities/coupon-usage.entity.js';
import { Discount } from './entities/discount.entity.js';
import { FlashSale } from './entities/flash-sale.entity.js';
import { NewsletterSubscriber } from './entities/newsletter-subscriber.entity.js';
import { AbandonedCart } from './entities/abandoned-cart.entity.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';

@Injectable()
export class MarketingService {
  constructor(
    @InjectRepository(Coupon) private couponRepo: Repository<Coupon>,
    @InjectRepository(CouponUsage) private usageRepo: Repository<CouponUsage>,
    @InjectRepository(Discount) private discountRepo: Repository<Discount>,
    @InjectRepository(FlashSale) private saleRepo: Repository<FlashSale>,
    @InjectRepository(NewsletterSubscriber) private subscriberRepo: Repository<NewsletterSubscriber>,
    @InjectRepository(AbandonedCart) private abandonedRepo: Repository<AbandonedCart>,
  ) {}

  // ==========================================
  // COUPON VALIDATION ENGINE
  // ==========================================

  async validateCoupon(
    code: string,
    userId: string,
    subtotal: number,
    itemProductIds: string[] = [],
    itemCategoryIds: string[] = [],
  ): Promise<{ coupon: Coupon; discount: number }> {
    const cleanCode = code.toUpperCase().trim();
    const coupon = await this.couponRepo.findOne({ where: { code: cleanCode, isActive: true } });
    if (!coupon) throw new NotFoundException('Coupon code is invalid or inactive');

    const now = new Date();
    if (coupon.startsAt && now < coupon.startsAt) {
      throw new BadRequestException('Coupon promotion has not started yet');
    }
    if (coupon.expiresAt && now > coupon.expiresAt) {
      throw new BadRequestException('Coupon code has expired');
    }

    if (coupon.usageLimit && coupon.timesUsed >= coupon.usageLimit) {
      throw new BadRequestException('Coupon maximum usage limit has been reached');
    }

    // Check user-level claim counts
    if (userId) {
      const userClaims = await this.usageRepo.count({
        where: { couponId: coupon.id, userId },
      });
      if (userClaims >= coupon.usagePerUser) {
        throw new BadRequestException('You have already reached the maximum usage limit for this coupon');
      }
    }

    if (subtotal < Number(coupon.minOrderAmount)) {
      throw new BadRequestException(`Minimum purchase of PKR ${coupon.minOrderAmount} is required for this coupon`);
    }

    // Check product applicability
    if (coupon.applicableProducts && coupon.applicableProducts.length > 0) {
      const match = itemProductIds.some((pid) => coupon.applicableProducts.includes(pid));
      if (!match) {
        throw new BadRequestException('This coupon code is not applicable to any products in your cart');
      }
    }

    // Check category applicability
    if (coupon.applicableCategories && coupon.applicableCategories.length > 0) {
      const match = itemCategoryIds.some((cid) => coupon.applicableCategories.includes(cid));
      if (!match) {
        throw new BadRequestException('This coupon code is not applicable to any product categories in your cart');
      }
    }

    // Calculate coupon discounts
    let discount = 0;
    if (coupon.discountType === 'fixed') {
      discount = Number(coupon.discountValue);
    } else if (coupon.discountType === 'percentage') {
      discount = subtotal * (Number(coupon.discountValue) / 100);
      if (coupon.maxDiscount && discount > Number(coupon.maxDiscount)) {
        discount = Number(coupon.maxDiscount);
      }
    }

    return { coupon, discount: Math.min(discount, subtotal) };
  }

  async trackCouponUsage(couponId: string, userId: string, orderId: string, discountApplied: number): Promise<CouponUsage> {
    const coupon = await this.couponRepo.findOne({ where: { id: couponId } });
    if (!coupon) throw new NotFoundException('Coupon not found');

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

  // ==========================================
  // DISCOUNTS & FLASH SALES CRUD
  // ==========================================

  // --- Coupons ---
  async findAllCoupons(): Promise<Coupon[]> {
    return this.couponRepo.find({ order: { code: 'ASC' } });
  }

  async findCouponById(id: string): Promise<Coupon> {
    const coupon = await this.couponRepo.findOne({ where: { id } });
    if (!coupon) throw new NotFoundException('Coupon not found');
    return coupon;
  }

  async createCoupon(dto: any): Promise<Coupon> {
    if (dto.code) dto.code = dto.code.toUpperCase().trim();
    const existing = await this.couponRepo.findOne({ where: { code: dto.code } });
    if (existing) throw new BadRequestException('Coupon code already exists');

    const coupon = this.couponRepo.create(dto as DeepPartial<Coupon>);
    return this.couponRepo.save(coupon);
  }

  async updateCoupon(id: string, dto: any): Promise<Coupon> {
    const coupon = await this.findCouponById(id);
    if (dto.code) dto.code = dto.code.toUpperCase().trim();
    Object.assign(coupon, dto);
    return this.couponRepo.save(coupon);
  }

  async deleteCoupon(id: string): Promise<void> {
    const coupon = await this.findCouponById(id);
    await this.couponRepo.remove(coupon);
  }

  // --- Auto-discounts ---
  async findAllDiscounts(): Promise<Discount[]> {
    return this.discountRepo.find({ order: { createdAt: 'DESC' } });
  }

  async createDiscount(dto: any): Promise<Discount> {
    const discount = this.discountRepo.create(dto as DeepPartial<Discount>);
    return this.discountRepo.save(discount);
  }

  async updateDiscount(id: string, dto: any): Promise<Discount> {
    const disc = await this.discountRepo.findOne({ where: { id } });
    if (!disc) throw new NotFoundException('Discount rule not found');
    Object.assign(disc, dto);
    return this.discountRepo.save(disc);
  }

  async deleteDiscount(id: string): Promise<void> {
    const disc = await this.discountRepo.findOne({ where: { id } });
    if (!disc) throw new NotFoundException('Discount rule not found');
    await this.discountRepo.remove(disc);
  }

  // --- Flash Sales ---
  async findAllFlashSales(): Promise<FlashSale[]> {
    return this.saleRepo.find({ order: { startsAt: 'ASC' } });
  }

  async createFlashSale(dto: any): Promise<FlashSale> {
    const sale = this.saleRepo.create(dto as DeepPartial<FlashSale>);
    return this.saleRepo.save(sale);
  }

  async updateFlashSale(id: string, dto: any): Promise<FlashSale> {
    const sale = await this.saleRepo.findOne({ where: { id } });
    if (!sale) throw new NotFoundException('Flash sale not found');
    Object.assign(sale, dto);
    return this.saleRepo.save(sale);
  }

  async deleteFlashSale(id: string): Promise<void> {
    const sale = await this.saleRepo.findOne({ where: { id } });
    if (!sale) throw new NotFoundException('Flash sale not found');
    await this.saleRepo.remove(sale);
  }

  // ==========================================
  // NEWSLETTER MARKETING
  // ==========================================

  async subscribeNewsletter(email: string, firstName?: string, source = 'website'): Promise<NewsletterSubscriber> {
    const cleanEmail = email.toLowerCase().trim();
    let sub = await this.subscriberRepo.findOne({ where: { email: cleanEmail } });

    if (sub) {
      if (sub.isActive) throw new BadRequestException('Email address is already subscribed');
      sub.isActive = true;
      sub.unsubscribedAt = null as any;
      if (firstName) sub.firstName = firstName;
      return this.subscriberRepo.save(sub);
    }

    sub = this.subscriberRepo.create({
      email: cleanEmail,
      firstName,
      source,
    });
    return this.subscriberRepo.save(sub);
  }

  async unsubscribeNewsletter(email: string): Promise<void> {
    const sub = await this.subscriberRepo.findOne({ where: { email: email.toLowerCase().trim() } });
    if (!sub) throw new NotFoundException('Subscriber not found');
    sub.isActive = false;
    sub.unsubscribedAt = new Date();
    await this.subscriberRepo.save(sub);
  }

  async findAllSubscribers(paginationDto: PaginationDto) {
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

  // ==========================================
  // ABANDONED CARTS
  // ==========================================

  async logAbandonedCart(userId: string | null, email: string, cartData: any, total: number): Promise<AbandonedCart> {
    const cleanEmail = email.toLowerCase().trim();
    
    // Check if there is an active abandoned cart in the last 24 hours to update
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

  async markCartRecovered(email: string, orderId: string): Promise<void> {
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

  async findAllAbandonedCarts(paginationDto: PaginationDto, unrecoveredOnly = false) {
    const page = paginationDto.page || 1;
    const limit = paginationDto.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (unrecoveredOnly) where.recovered = false;

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

  async triggerRecoveryEmails(): Promise<any> {
    // Find unrecovered carts that haven't received recovery reminder email
    const carts = await this.abandonedRepo.find({
      where: { recovered: false, recoveryEmailSent: false },
    });

    for (const cart of carts) {
      // Simulate/Trigger email dispatch
      cart.recoveryEmailSent = true;
      cart.recoveryEmailSentAt = new Date();
      await this.abandonedRepo.save(cart);
    }

    return {
      triggeredCount: carts.length,
    };
  }
}
