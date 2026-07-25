import { Category } from '../../products/entities/category.entity.js';
export declare class CategoryCard {
    id: string;
    categoryId: string;
    category: Category;
    displayName: string;
    itemCountLabel: string;
    bgColor: string;
    sortOrder: number;
    isActive: boolean;
}
