import { Product } from './product.entity.js';
export declare class ProductImage {
    id: string;
    productId: string;
    product: Product;
    imageData: Buffer;
    mimeType: string;
    filename: string;
    altText: string;
    isPrimary: boolean;
    sortOrder: number;
    createdAt: Date;
}
