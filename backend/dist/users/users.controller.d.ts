import { UsersService } from './users.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { CreateAddressDto } from './dto/create-address.dto.js';
import { UpdateAddressDto } from './dto/update-address.dto.js';
import { UpdateNotificationPreferenceDto } from './dto/update-notification.dto.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(user: any): Promise<import("./entities/user.entity.js").User>;
    updateProfile(user: any, updateDto: UpdateUserDto): Promise<import("./entities/user.entity.js").User>;
    changePassword(user: any, changeDto: any): Promise<void>;
    addAddress(user: any, createAddressDto: CreateAddressDto): Promise<import("./entities/user-address.entity.js").UserAddress>;
    updateAddress(user: any, addressId: string, updateAddressDto: UpdateAddressDto): Promise<import("./entities/user-address.entity.js").UserAddress>;
    deleteAddress(user: any, addressId: string): Promise<void>;
    updateNotifications(user: any, updateDto: UpdateNotificationPreferenceDto): Promise<import("./entities/notification-preference.entity.js").NotificationPreference>;
    findAll(paginationDto: PaginationDto): Promise<{
        users: import("./entities/user.entity.js").User[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<import("./entities/user.entity.js").User>;
    adminUpdate(id: string, updateDto: UpdateUserDto): Promise<import("./entities/user.entity.js").User>;
    adminDelete(id: string): Promise<import("./entities/user.entity.js").User>;
}
