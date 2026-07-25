"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const user_entity_js_1 = require("./entities/user.entity.js");
const role_entity_js_1 = require("./entities/role.entity.js");
const user_address_entity_js_1 = require("./entities/user-address.entity.js");
const notification_preference_entity_js_1 = require("./entities/notification-preference.entity.js");
let UsersService = class UsersService {
    userRepository;
    roleRepository;
    addressRepository;
    prefRepository;
    constructor(userRepository, roleRepository, addressRepository, prefRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.addressRepository = addressRepository;
        this.prefRepository = prefRepository;
    }
    async create(createUserDto, roleName = 'customer') {
        const existing = await this.userRepository.findOne({ where: { email: createUserDto.email } });
        if (existing) {
            throw new common_1.ConflictException('Email already registered');
        }
        let role = await this.roleRepository.findOne({ where: { name: roleName } });
        if (!role && roleName === 'customer') {
            role = this.roleRepository.create({
                name: 'customer',
                description: 'Customer Account',
                permissions: ['place_orders', 'write_reviews', 'manage_profile'],
            });
            await this.roleRepository.save(role);
        }
        const passwordHash = await bcrypt.hash(createUserDto.password, 10);
        const user = this.userRepository.create({
            firstName: createUserDto.firstName,
            lastName: createUserDto.lastName,
            email: createUserDto.email,
            phone: createUserDto.phone,
            passwordHash,
            role: role || undefined,
        });
        const savedUser = await this.userRepository.save(user);
        const prefs = this.prefRepository.create({
            userId: savedUser.id,
            emailOrders: true,
            emailPromos: true,
            smsOrders: false,
            smsPromos: false,
            pushEnabled: false,
        });
        await this.prefRepository.save(prefs);
        delete savedUser.passwordHash;
        return savedUser;
    }
    async findByEmail(email, includePassword = false) {
        const query = this.userRepository.createQueryBuilder('user')
            .leftJoinAndSelect('user.role', 'role')
            .where('user.email = :email', { email });
        if (includePassword) {
            query.addSelect('user.passwordHash');
        }
        return query.getOne();
    }
    async findById(id) {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: { role: true, addresses: true, notificationPreference: true },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async findAll(paginationDto) {
        const page = paginationDto.page || 1;
        const limit = paginationDto.limit || 10;
        const skip = (page - 1) * limit;
        const [users, total] = await this.userRepository.findAndCount({
            relations: { role: true },
            order: { createdAt: 'DESC' },
            take: limit,
            skip,
        });
        return {
            users,
            total,
            page,
            limit,
        };
    }
    async update(id, updateUserDto) {
        const user = await this.findById(id);
        if (updateUserDto.email && updateUserDto.email !== user.email) {
            const existing = await this.findByEmail(updateUserDto.email);
            if (existing) {
                throw new common_1.ConflictException('Email already registered');
            }
        }
        Object.assign(user, updateUserDto);
        return this.userRepository.save(user);
    }
    async addAddress(userId, createAddressDto) {
        await this.findById(userId);
        if (createAddressDto.isDefault) {
            await this.addressRepository.update({ userId, isDefault: true }, { isDefault: false });
        }
        const address = this.addressRepository.create({
            ...createAddressDto,
            userId,
        });
        return this.addressRepository.save(address);
    }
    async updateAddress(userId, addressId, updateAddressDto) {
        const address = await this.addressRepository.findOne({ where: { id: addressId, userId } });
        if (!address) {
            throw new common_1.NotFoundException('Address not found');
        }
        if (updateAddressDto.isDefault) {
            await this.addressRepository.update({ userId, isDefault: true }, { isDefault: false });
        }
        Object.assign(address, updateAddressDto);
        return this.addressRepository.save(address);
    }
    async deleteAddress(userId, addressId) {
        const address = await this.addressRepository.findOne({ where: { id: addressId, userId } });
        if (!address) {
            throw new common_1.NotFoundException('Address not found');
        }
        await this.addressRepository.remove(address);
    }
    async updateNotificationPrefs(userId, updateDto) {
        let pref = await this.prefRepository.findOne({ where: { userId } });
        if (!pref) {
            pref = this.prefRepository.create({ userId });
        }
        Object.assign(pref, updateDto);
        return this.prefRepository.save(pref);
    }
    async changePassword(userId, changeDto) {
        const user = await this.userRepository.createQueryBuilder('user')
            .addSelect('user.passwordHash')
            .where('user.id = :userId', { userId })
            .getOne();
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const isMatch = await bcrypt.compare(changeDto.oldPassword, user.passwordHash);
        if (!isMatch) {
            throw new common_1.BadRequestException('Incorrect old password');
        }
        user.passwordHash = await bcrypt.hash(changeDto.newPassword, 10);
        await this.userRepository.save(user);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_js_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(role_entity_js_1.Role)),
    __param(2, (0, typeorm_1.InjectRepository)(user_address_entity_js_1.UserAddress)),
    __param(3, (0, typeorm_1.InjectRepository)(notification_preference_entity_js_1.NotificationPreference)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map