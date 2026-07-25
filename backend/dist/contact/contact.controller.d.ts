import { ContactService } from './contact.service.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';
export declare class ContactController {
    private readonly contactService;
    constructor(contactService: ContactService);
    submitMessage(dto: any): Promise<import("./entities/contact-message.entity.js").ContactMessage>;
    adminGetMessages(paginationDto: PaginationDto, status?: string): Promise<{
        messages: import("./entities/contact-message.entity.js").ContactMessage[];
        total: number;
        page: number;
        limit: number;
    }>;
    adminGetMessage(id: string): Promise<import("./entities/contact-message.entity.js").ContactMessage>;
    adminUpdateMessage(id: string, status: string, assignedTo?: string): Promise<import("./entities/contact-message.entity.js").ContactMessage>;
}
