import { Role } from './role.entity.js';
import { UserAddress } from './user-address.entity.js';
import { NotificationPreference } from './notification-preference.entity.js';
export declare class User {
    id: string;
    roleId: string;
    role: Role;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    passwordHash: string;
    avatarData: Buffer;
    avatarMime: string;
    isActive: boolean;
    isVerified: boolean;
    lastLoginAt: Date;
    createdAt: Date;
    updatedAt: Date;
    addresses: UserAddress[];
    notificationPreference: NotificationPreference;
}
