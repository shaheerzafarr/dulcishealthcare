import type { Response } from 'express';
import { MediaService } from './media.service.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';
export declare class MediaController {
    private readonly mediaService;
    constructor(mediaService: MediaService);
    serveFile(id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    adminGetFiles(paginationDto: PaginationDto, folder?: string): Promise<{
        media: import("./entities/media.entity.js").Media[];
        total: number;
        page: number;
        limit: number;
    }>;
    adminUploadFile(file: Express.Multer.File, folder?: string, altText?: string): Promise<import("./entities/media.entity.js").Media>;
    adminDeleteFile(id: string): Promise<void>;
}
