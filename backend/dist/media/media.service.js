"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const media_entity_js_1 = require("./entities/media.entity.js");
let MediaService = class MediaService {
    mediaRepo;
    constructor(mediaRepo) {
        this.mediaRepo = mediaRepo;
    }
    async uploadFile(file, folder = 'general', altText) {
        const media = this.mediaRepo.create({
            filename: file.originalname,
            mimeType: file.mimetype,
            fileSize: file.size,
            fileData: file.buffer,
            folder,
            altText,
        });
        const saved = await this.mediaRepo.save(media);
        delete saved.fileData;
        return saved;
    }
    async findAll(paginationDto, folder) {
        const page = paginationDto.page || 1;
        const limit = paginationDto.limit || 12;
        const skip = (page - 1) * limit;
        const where = {};
        if (folder)
            where.folder = folder;
        const [mediaItems, total] = await this.mediaRepo.findAndCount({
            where,
            order: { createdAt: 'DESC' },
            take: limit,
            skip,
        });
        const cleaned = mediaItems.map(item => {
            delete item.fileData;
            return item;
        });
        return {
            media: cleaned,
            total,
            page,
            limit,
        };
    }
    async getRawFile(id) {
        const media = await this.mediaRepo.findOne({ where: { id } });
        if (!media)
            throw new common_1.NotFoundException('File not found');
        return { data: media.fileData, mime: media.mimeType };
    }
    async getFileDetails(id) {
        const media = await this.mediaRepo.findOne({ where: { id } });
        if (!media)
            throw new common_1.NotFoundException('File not found');
        delete media.fileData;
        return media;
    }
    async deleteFile(id) {
        const media = await this.mediaRepo.findOne({ where: { id } });
        if (!media)
            throw new common_1.NotFoundException('File not found');
        await this.mediaRepo.remove(media);
    }
};
exports.MediaService = MediaService;
exports.MediaService = MediaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(media_entity_js_1.Media)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], MediaService);
//# sourceMappingURL=media.service.js.map