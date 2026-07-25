import { User } from '../../users/entities/user.entity.js';
export declare class Blog {
    id: string;
    authorId: string;
    author: User;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverData: Buffer;
    coverMime: string;
    metaTitle: string;
    metaDescription: string;
    isActive: boolean;
    publishedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
