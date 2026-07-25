import { User } from './user.entity.js';
export declare class Role {
    id: string;
    name: string;
    description: string;
    permissions: string[];
    createdAt: Date;
    updatedAt: Date;
    users: User[];
}
