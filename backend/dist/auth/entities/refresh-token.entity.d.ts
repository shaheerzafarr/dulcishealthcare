import { User } from '../../users/entities/user.entity.js';
export declare class RefreshToken {
    id: string;
    userId: string;
    user: User;
    tokenHash: string;
    expiresAt: Date;
    isRevoked: boolean;
    createdAt: Date;
}
