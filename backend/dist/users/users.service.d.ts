import { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';
import { Role } from './entities/role.entity.js';
import { UserAddress } from './entities/user-address.entity.js';
import { NotificationPreference } from './entities/notification-preference.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { CreateAddressDto } from './dto/create-address.dto.js';
import { UpdateAddressDto } from './dto/update-address.dto.js';
import { UpdateNotificationPreferenceDto } from './dto/update-notification.dto.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';
export declare class UsersService {
    private userRepository;
    private roleRepository;
    private addressRepository;
    private prefRepository;
    constructor(userRepository: Repository<User>, roleRepository: Repository<Role>, addressRepository: Repository<UserAddress>, prefRepository: Repository<NotificationPreference>);
    create(createUserDto: CreateUserDto, roleName?: string): Promise<User>;
    findByEmail(email: string, includePassword?: boolean): Promise<User | null>;
    findById(id: string): Promise<User>;
    findAll(paginationDto: PaginationDto): Promise<{
        users: User[];
        total: number;
        page: number;
        limit: number;
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    addAddress(userId: string, createAddressDto: CreateAddressDto): Promise<UserAddress>;
    updateAddress(userId: string, addressId: string, updateAddressDto: UpdateAddressDto): Promise<UserAddress>;
    deleteAddress(userId: string, addressId: string): Promise<void>;
    updateNotificationPrefs(userId: string, updateDto: UpdateNotificationPreferenceDto): Promise<NotificationPreference>;
    changePassword(userId: string, changeDto: any): Promise<void>;
}
