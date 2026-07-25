import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Media } from './entities/media.entity.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private mediaRepo: Repository<Media>,
  ) {}

  async uploadFile(file: Express.Multer.File, folder = 'general', altText?: string): Promise<Media> {
    const media = this.mediaRepo.create({
      filename: file.originalname,
      mimeType: file.mimetype,
      fileSize: file.size,
      fileData: file.buffer,
      folder,
      altText,
    });
    const saved = await this.mediaRepo.save(media);
    delete (saved as any).fileData;
    return saved;
  }

  async findAll(paginationDto: PaginationDto, folder?: string) {
    const page = paginationDto.page || 1;
    const limit = paginationDto.limit || 12;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (folder) where.folder = folder;

    const [mediaItems, total] = await this.mediaRepo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      take: limit,
      skip,
    });

    // Clean binary files from grid list payload to optimize memory
    const cleaned = mediaItems.map(item => {
      delete (item as any).fileData;
      return item;
    });

    return {
      media: cleaned,
      total,
      page,
      limit,
    };
  }

  async getRawFile(id: string): Promise<{ data: Buffer; mime: string }> {
    const media = await this.mediaRepo.findOne({ where: { id } });
    if (!media) throw new NotFoundException('File not found');
    return { data: media.fileData, mime: media.mimeType };
  }

  async getFileDetails(id: string): Promise<Media> {
    const media = await this.mediaRepo.findOne({ where: { id } });
    if (!media) throw new NotFoundException('File not found');
    delete (media as any).fileData;
    return media;
  }

  async deleteFile(id: string): Promise<void> {
    const media = await this.mediaRepo.findOne({ where: { id } });
    if (!media) throw new NotFoundException('File not found');
    await this.mediaRepo.remove(media);
  }
}
