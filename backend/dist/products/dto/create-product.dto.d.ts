export declare class CreateProductDto {
    categoryId: string;
    name: string;
    sku?: string;
    description?: string;
    details?: string;
    basePrice: number;
    comparePrice?: number;
    costPrice?: number;
    isActive?: boolean;
    isFeatured?: boolean;
    metaTitle?: string;
    metaDescription?: string;
    tags?: string[];
    ingredients?: string[];
    benefits?: string[];
}
