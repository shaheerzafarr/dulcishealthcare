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
exports.ContactService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const contact_message_entity_js_1 = require("./entities/contact-message.entity.js");
let ContactService = class ContactService {
    contactRepo;
    constructor(contactRepo) {
        this.contactRepo = contactRepo;
    }
    async submitMessage(dto) {
        const msg = this.contactRepo.create(dto);
        return this.contactRepo.save(msg);
    }
    async findAll(paginationDto, status) {
        const page = paginationDto.page || 1;
        const limit = paginationDto.limit || 10;
        const skip = (page - 1) * limit;
        const where = {};
        if (status)
            where.status = status;
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
    async findById(id) {
        const msg = await this.contactRepo.findOne({ where: { id }, relations: { assignedStaff: true } });
        if (!msg)
            throw new common_1.NotFoundException('Message not found');
        return msg;
    }
    async updateStatus(id, status, assignedTo) {
        const msg = await this.findById(id);
        msg.status = status;
        if (assignedTo !== undefined)
            msg.assignedTo = assignedTo || null;
        return this.contactRepo.save(msg);
    }
};
exports.ContactService = ContactService;
exports.ContactService = ContactService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(contact_message_entity_js_1.ContactMessage)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ContactService);
//# sourceMappingURL=contact.service.js.map