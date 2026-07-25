import { Product } from './product.entity.js';
export declare class ProductIngredient {
    id: string;
    productId: string;
    product: Product;
    name: string;
    sortOrder: number;
}
