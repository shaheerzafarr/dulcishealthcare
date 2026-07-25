export declare class CheckoutDto {
    shippingName: string;
    shippingPhone?: string;
    shippingLine1: string;
    shippingLine2?: string;
    shippingCity: string;
    shippingState?: string;
    shippingPostal: string;
    shippingCountry?: string;
    billingName?: string;
    billingLine1?: string;
    billingCity?: string;
    billingState?: string;
    billingPostal?: string;
    billingCountry?: string;
    billingSameAsShipping?: boolean;
    shippingRateId: string;
    couponCode?: string;
    notes?: string;
    paymentMethod: string;
}
