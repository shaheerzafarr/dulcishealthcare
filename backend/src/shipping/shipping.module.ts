import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingZone } from './entities/shipping-zone.entity.js';
import { ShippingRate } from './entities/shipping-rate.entity.js';
import { TaxRule } from './entities/tax-rule.entity.js';
import { ShippingService } from './shipping.service.js';
import { ShippingController } from './shipping.controller.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ShippingZone,
      ShippingRate,
      TaxRule,
    ]),
  ],
  providers: [ShippingService],
  controllers: [ShippingController],
  exports: [ShippingService],
})
export class ShippingModule {}
