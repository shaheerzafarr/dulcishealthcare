import { Product } from './product.entity.js';
export declare class ProductTag {
    id: string;
    productId: string;
    product: Product;
    tag: string;
    createdAt: Date;
}
