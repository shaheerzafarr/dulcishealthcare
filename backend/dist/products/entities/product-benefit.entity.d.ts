import { Product } from './product.entity.js';
export declare class ProductBenefit {
    id: string;
    productId: string;
    product: Product;
    benefit: string;
    sortOrder: number;
}
