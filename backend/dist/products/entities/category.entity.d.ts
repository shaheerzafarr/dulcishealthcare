import { Product } from './product.entity.js';
export declare class Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    icon: string;
    imageData: Buffer;
    imageMime: string;
    sortOrder: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    products: Product[];
}
