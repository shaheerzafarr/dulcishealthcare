export declare class Navigation {
    id: string;
    parentId: string;
    parent: Navigation;
    children: Navigation[];
    label: string;
    link: string;
    location: string;
    sortOrder: number;
    isActive: boolean;
    createdAt: Date;
}
