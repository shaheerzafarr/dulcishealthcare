import { Repository } from 'typeorm';
import { ContactMessage } from './entities/contact-message.entity.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';
export declare class ContactService {
    private contactRepo;
    constructor(contactRepo: Repository<ContactMessage>);
    submitMessage(dto: any): Promise<ContactMessage>;
    findAll(paginationDto: PaginationDto, status?: string): Promise<{
        messages: ContactMessage[];
        total: number;
        page: number;
        limit: number;
    }>;
    findById(id: string): Promise<ContactMessage>;
    updateStatus(id: string, status: string, assignedTo?: string): Promise<ContactMessage>;
}
