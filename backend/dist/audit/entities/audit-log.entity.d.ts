import { User } from '../../users/entities/user.entity.js';
export declare class AuditLog {
    id: string;
    userId: string;
    user: User;
    action: string;
    entityType: string;
    entityId: string;
    oldValues: any;
    newValues: any;
    ipAddress: string;
    userAgent: string;
    createdAt: Date;
}
