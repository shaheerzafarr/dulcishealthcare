import { PageSection } from './page-section.entity.js';
export declare class Page {
    id: string;
    title: string;
    slug: string;
    metaTitle: string;
    metaDescription: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    sections: PageSection[];
}
