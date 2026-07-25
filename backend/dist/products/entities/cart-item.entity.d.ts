import { Cart } from './cart.entity.js';
import { Product } from './product.entity.js';
import { ProductVariant } from './product-variant.entity.js';
export declare class CartItem {
    id: string;
    cartId: string;
    cart: Cart;
    productId: string;
    product: Product;
    variantId: string;
    variant: ProductVariant;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
}
