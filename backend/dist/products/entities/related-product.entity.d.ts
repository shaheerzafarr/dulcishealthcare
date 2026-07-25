import { Product } from './product.entity.js';
export declare class RelatedProduct {
    id: string;
    productId: string;
    product: Product;
    relatedId: string;
    related: Product;
    relationType: string;
    sortOrder: number;
}
