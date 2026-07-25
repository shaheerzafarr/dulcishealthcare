import { Repository } from 'typeorm';
import { Media } from './entities/media.entity.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';
export declare class MediaService {
    private mediaRepo;
    constructor(mediaRepo: Repository<Media>);
    uploadFile(file: Express.Multer.File, folder?: string, altText?: string): Promise<Media>;
    findAll(paginationDto: PaginationDto, folder?: string): Promise<{
        media: Media[];
        total: number;
        page: number;
        limit: number;
    }>;
    getRawFile(id: string): Promise<{
        data: Buffer;
        mime: string;
    }>;
    getFileDetails(id: string): Promise<Media>;
    deleteFile(id: string): Promise<void>;
}
