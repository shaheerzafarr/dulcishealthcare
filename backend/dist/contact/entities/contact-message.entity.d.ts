import { User } from '../../users/entities/user.entity.js';
export declare class ContactMessage {
    id: string;
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    status: string;
    assignedTo: string;
    assignedStaff: User;
    createdAt: Date;
    updatedAt: Date;
}
