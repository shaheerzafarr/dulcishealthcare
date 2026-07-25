import { ShippingRate } from './shipping-rate.entity.js';
export declare class ShippingZone {
    id: string;
    name: string;
    countries: string[];
    states: string[];
    isActive: boolean;
    createdAt: Date;
    rates: ShippingRate[];
}
