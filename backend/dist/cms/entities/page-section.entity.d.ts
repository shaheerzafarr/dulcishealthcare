import { Page } from './page.entity.js';
export declare class PageSection {
    id: string;
    pageId: string;
    page: Page;
    type: string;
    content: any;
    sortOrder: number;
}
