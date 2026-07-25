import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
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

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(UserAddress)
    private addressRepository: Repository<UserAddress>,
    @InjectRepository(NotificationPreference)
    private prefRepository: Repository<NotificationPreference>,
  ) {}

  async create(createUserDto: CreateUserDto, roleName: string = 'customer'): Promise<User> {
    const existing = await this.userRepository.findOne({ where: { email: createUserDto.email } });
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    let role = await this.roleRepository.findOne({ where: { name: roleName } });
    if (!role && roleName === 'customer') {
      // Seed roles on demand if they aren't seeded yet
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

    // Create default notification preference
    const prefs = this.prefRepository.create({
      userId: savedUser.id,
      emailOrders: true,
      emailPromos: true,
      smsOrders: false,
      smsPromos: false,
      pushEnabled: false,
    });
    await this.prefRepository.save(prefs);

    delete (savedUser as any).passwordHash;
    return savedUser;
  }

  async findByEmail(email: string, includePassword = false): Promise<User | null> {
    const query = this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.email = :email', { email });

    if (includePassword) {
      query.addSelect('user.passwordHash');
    }

    return query.getOne();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { role: true, addresses: true, notificationPreference: true },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findAll(paginationDto: PaginationDto) {
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

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existing = await this.findByEmail(updateUserDto.email);
      if (existing) {
        throw new ConflictException('Email already registered');
      }
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async addAddress(userId: string, createAddressDto: CreateAddressDto): Promise<UserAddress> {
    await this.findById(userId); // ensure user exists

    if (createAddressDto.isDefault) {
      await this.addressRepository.update(
        { userId, isDefault: true },
        { isDefault: false },
      );
    }

    const address = this.addressRepository.create({
      ...createAddressDto,
      userId,
    });

    return this.addressRepository.save(address);
  }

  async updateAddress(userId: string, addressId: string, updateAddressDto: UpdateAddressDto): Promise<UserAddress> {
    const address = await this.addressRepository.findOne({ where: { id: addressId, userId } });
    if (!address) {
      throw new NotFoundException('Address not found');
    }

    if (updateAddressDto.isDefault) {
      await this.addressRepository.update(
        { userId, isDefault: true },
        { isDefault: false },
      );
    }

    Object.assign(address, updateAddressDto);
    return this.addressRepository.save(address);
  }

  async deleteAddress(userId: string, addressId: string): Promise<void> {
    const address = await this.addressRepository.findOne({ where: { id: addressId, userId } });
    if (!address) {
      throw new NotFoundException('Address not found');
    }
    await this.addressRepository.remove(address);
  }

  async updateNotificationPrefs(userId: string, updateDto: UpdateNotificationPreferenceDto): Promise<NotificationPreference> {
    let pref = await this.prefRepository.findOne({ where: { userId } });
    if (!pref) {
      pref = this.prefRepository.create({ userId });
    }
    Object.assign(pref, updateDto);
    return this.prefRepository.save(pref);
  }

  async changePassword(userId: string, changeDto: any): Promise<void> {
    const user = await this.userRepository.createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.id = :userId', { userId })
      .getOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(changeDto.oldPassword, user.passwordHash);
    if (!isMatch) {
      throw new BadRequestException('Incorrect old password');
    }

    user.passwordHash = await bcrypt.hash(changeDto.newPassword, 10);
    await this.userRepository.save(user);
  }
}
