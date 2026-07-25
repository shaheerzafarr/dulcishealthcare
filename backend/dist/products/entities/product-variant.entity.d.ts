import { Product } from './product.entity.js';
import { ProductInventory } from './product-inventory.entity.js';
export declare class ProductVariant {
    id: string;
    productId: string;
    product: Product;
    name: string;
    sku: string;
    price: number;
    comparePrice: number;
    weightGrams: number;
    isActive: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
    inventory: ProductInventory;
}
