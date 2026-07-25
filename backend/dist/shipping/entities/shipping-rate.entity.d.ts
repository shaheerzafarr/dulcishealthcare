import { ShippingZone } from './shipping-zone.entity.js';
export declare class ShippingRate {
    id: string;
    zoneId: string;
    zone: ShippingZone;
    name: string;
    minOrderAmount: number;
    rate: number;
    ratePerKg: number;
    estimatedDaysMin: number;
    estimatedDaysMax: number;
    isActive: boolean;
    createdAt: Date;
}
