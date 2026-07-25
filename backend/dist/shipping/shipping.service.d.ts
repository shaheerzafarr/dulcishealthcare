import { Repository } from 'typeorm';
import { ShippingZone } from './entities/shipping-zone.entity.js';
import { ShippingRate } from './entities/shipping-rate.entity.js';
import { TaxRule } from './entities/tax-rule.entity.js';
export declare class ShippingService {
    private zoneRepo;
    private rateRepo;
    private taxRepo;
    constructor(zoneRepo: Repository<ShippingZone>, rateRepo: Repository<ShippingRate>, taxRepo: Repository<TaxRule>);
    findAllZones(): Promise<ShippingZone[]>;
    findZoneById(id: string): Promise<ShippingZone>;
    createZone(dto: any): Promise<ShippingZone>;
    updateZone(id: string, dto: any): Promise<ShippingZone>;
    deleteZone(id: string): Promise<void>;
    findAllRates(): Promise<ShippingRate[]>;
    findRateById(id: string): Promise<ShippingRate>;
    createRate(dto: any): Promise<ShippingRate>;
    updateRate(id: string, dto: any): Promise<ShippingRate>;
    deleteRate(id: string): Promise<void>;
    findAllTaxes(): Promise<TaxRule[]>;
    findTaxById(id: string): Promise<TaxRule>;
    createTax(dto: any): Promise<TaxRule>;
    updateTax(id: string, dto: any): Promise<TaxRule>;
    deleteTax(id: string): Promise<void>;
    calculateTaxRate(country: string, state?: string): Promise<number>;
}
