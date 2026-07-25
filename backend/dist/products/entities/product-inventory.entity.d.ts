import { ProductVariant } from './product-variant.entity.js';
export declare class ProductInventory {
    id: string;
    variantId: string;
    variant: ProductVariant;
    quantity: number;
    reserved: number;
    lowStockThreshold: number;
    trackInventory: boolean;
    updatedAt: Date;
}
