import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Coupon } from './entities/coupon.entity.js';
import { CouponUsage } from './entities/coupon-usage.entity.js';
import { Discount } from './entities/discount.entity.js';
import { FlashSale } from './entities/flash-sale.entity.js';
import { NewsletterSubscriber } from './entities/newsletter-subscriber.entity.js';
import { AbandonedCart } from './entities/abandoned-cart.entity.js';
import { MarketingService } from './marketing.service.js';
import { MarketingController } from './marketing.controller.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Coupon,
      CouponUsage,
      Discount,
      FlashSale,
      NewsletterSubscriber,
      AbandonedCart,
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: configService.get<any>('jwt.expiresIn'),
        },
      }),
    }),
  ],
  providers: [MarketingService],
  controllers: [MarketingController],
  exports: [MarketingService],
})
export class MarketingModule {}
