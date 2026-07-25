import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { ContactMessage } from './entities/contact-message.entity.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(ContactMessage)
    private contactRepo: Repository<ContactMessage>,
  ) {}

  async submitMessage(dto: any): Promise<ContactMessage> {
    const msg = this.contactRepo.create(dto as DeepPartial<ContactMessage>);
    return this.contactRepo.save(msg);
  }

  async findAll(paginationDto: PaginationDto, status?: string) {
    const page = paginationDto.page || 1;
    const limit = paginationDto.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;

    const [messages, total] = await this.contactRepo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      relations: { assignedStaff: true },
      take: limit,
      skip,
    });

    return {
      messages,
      total,
      page,
      limit,
    };
  }

  async findById(id: string): Promise<ContactMessage> {
    const msg = await this.contactRepo.findOne({ where: { id }, relations: { assignedStaff: true } });
    if (!msg) throw new NotFoundException('Message not found');
    return msg;
  }

  async updateStatus(id: string, status: string, assignedTo?: string): Promise<ContactMessage> {
    const msg = await this.findById(id);
    msg.status = status;
    if (assignedTo !== undefined) msg.assignedTo = assignedTo || null as any;
    return this.contactRepo.save(msg);
  }
}
