export declare class Discount {
    id: string;
    name: string;
    discountType: string;
    discountValue: number;
    applyTo: string;
    applyToIds: string[];
    startsAt: Date;
    endsAt: Date;
    isActive: boolean;
    createdAt: Date;
}
