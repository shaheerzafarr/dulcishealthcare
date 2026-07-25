import { ShippingService } from './shipping.service.js';
export declare class ShippingController {
    private readonly shippingService;
    constructor(shippingService: ShippingService);
    getRates(): Promise<import("./entities/shipping-rate.entity.js").ShippingRate[]>;
    adminGetZones(): Promise<import("./entities/shipping-zone.entity.js").ShippingZone[]>;
    adminCreateZone(dto: any): Promise<import("./entities/shipping-zone.entity.js").ShippingZone>;
    adminUpdateZone(id: string, dto: any): Promise<import("./entities/shipping-zone.entity.js").ShippingZone>;
    adminDeleteZone(id: string): Promise<void>;
    adminGetRates(): Promise<import("./entities/shipping-rate.entity.js").ShippingRate[]>;
    adminCreateRate(dto: any): Promise<import("./entities/shipping-rate.entity.js").ShippingRate>;
    adminUpdateRate(id: string, dto: any): Promise<import("./entities/shipping-rate.entity.js").ShippingRate>;
    adminDeleteRate(id: string): Promise<void>;
    adminGetTaxes(): Promise<import("./entities/tax-rule.entity.js").TaxRule[]>;
    adminCreateTax(dto: any): Promise<import("./entities/tax-rule.entity.js").TaxRule>;
    adminUpdateTax(id: string, dto: any): Promise<import("./entities/tax-rule.entity.js").TaxRule>;
    adminDeleteTax(id: string): Promise<void>;
}
