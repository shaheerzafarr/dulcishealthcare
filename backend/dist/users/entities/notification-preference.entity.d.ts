import { User } from './user.entity.js';
export declare class NotificationPreference {
    id: string;
    userId: string;
    user: User;
    emailOrders: boolean;
    emailPromos: boolean;
    smsOrders: boolean;
    smsPromos: boolean;
    pushEnabled: boolean;
    updatedAt: Date;
}
