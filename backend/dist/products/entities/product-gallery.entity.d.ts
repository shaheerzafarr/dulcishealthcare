import { Product } from './product.entity.js';
export declare class ProductGallery {
    id: string;
    productId: string;
    product: Product;
    imageData: Buffer;
    mimeType: string;
    filename: string;
    caption: string;
    sortOrder: number;
    createdAt: Date;
}
