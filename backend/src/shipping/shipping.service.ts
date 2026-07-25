import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { ShippingZone } from './entities/shipping-zone.entity.js';
import { ShippingRate } from './entities/shipping-rate.entity.js';
import { TaxRule } from './entities/tax-rule.entity.js';

@Injectable()
export class ShippingService {
  constructor(
    @InjectRepository(ShippingZone) private zoneRepo: Repository<ShippingZone>,
    @InjectRepository(ShippingRate) private rateRepo: Repository<ShippingRate>,
    @InjectRepository(TaxRule) private taxRepo: Repository<TaxRule>,
  ) {}

  // ==========================================
  // SHIPPING ZONES & RATES
  // ==========================================

  async findAllZones(): Promise<ShippingZone[]> {
    return this.zoneRepo.find({ relations: { rates: true } });
  }

  async findZoneById(id: string): Promise<ShippingZone> {
    const zone = await this.zoneRepo.findOne({ where: { id }, relations: { rates: true } });
    if (!zone) throw new NotFoundException('Shipping zone not found');
    return zone;
  }

  async createZone(dto: any): Promise<ShippingZone> {
    const zone = this.zoneRepo.create(dto as DeepPartial<ShippingZone>);
    return this.zoneRepo.save(zone);
  }

  async updateZone(id: string, dto: any): Promise<ShippingZone> {
    const zone = await this.findZoneById(id);
    Object.assign(zone, dto);
    return this.zoneRepo.save(zone);
  }

  async deleteZone(id: string): Promise<void> {
    const zone = await this.findZoneById(id);
    await this.zoneRepo.remove(zone);
  }

  async findAllRates(): Promise<ShippingRate[]> {
    return this.rateRepo.find({ relations: { zone: true } });
  }

  async findRateById(id: string): Promise<ShippingRate> {
    const rate = await this.rateRepo.findOne({ where: { id }, relations: { zone: true } });
    if (!rate) throw new NotFoundException('Shipping rate not found');
    return rate;
  }

  async createRate(dto: any): Promise<ShippingRate> {
    await this.findZoneById(dto.zoneId); // ensure zone exists
    const rate = this.rateRepo.create(dto as DeepPartial<ShippingRate>);
    return this.rateRepo.save(rate);
  }

  async updateRate(id: string, dto: any): Promise<ShippingRate> {
    const rate = await this.findRateById(id);
    Object.assign(rate, dto);
    return this.rateRepo.save(rate);
  }

  async deleteRate(id: string): Promise<void> {
    const rate = await this.findRateById(id);
    await this.rateRepo.remove(rate);
  }

  // ==========================================
  // TAX RULES
  // ==========================================

  async findAllTaxes(): Promise<TaxRule[]> {
    return this.taxRepo.find();
  }

  async findTaxById(id: string): Promise<TaxRule> {
    const rule = await this.taxRepo.findOne({ where: { id } });
    if (!rule) throw new NotFoundException('Tax rule not found');
    return rule;
  }

  async createTax(dto: any): Promise<TaxRule> {
    const rule = this.taxRepo.create(dto as DeepPartial<TaxRule>);
    return this.taxRepo.save(rule);
  }

  async updateTax(id: string, dto: any): Promise<TaxRule> {
    const rule = await this.findTaxById(id);
    Object.assign(rule, dto);
    return this.taxRepo.save(rule);
  }

  async deleteTax(id: string): Promise<void> {
    const rule = await this.findTaxById(id);
    await this.taxRepo.remove(rule);
  }

  async calculateTaxRate(country: string, state?: string): Promise<number> {
    // Find active tax rule matching geographic indicators, default to standard GST
    const match = await this.taxRepo.findOne({
      where: { country, state: state || undefined, isActive: true },
    });
    if (match) return Number(match.rate);

    // General fallback rule
    const fallback = await this.taxRepo.findOne({
      where: { country, isActive: true },
    });
    return fallback ? Number(fallback.rate) : 0;
  }
}
