import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service.js';
import { RefreshToken } from './entities/refresh-token.entity.js';
export declare class AuthService {
    usersService: UsersService;
    private jwtService;
    private configService;
    private tokenRepository;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService, tokenRepository: Repository<RefreshToken>);
    validateUser(email: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: any;
            firstName: any;
            lastName: any;
            email: any;
            role: any;
        };
    }>;
    refresh(userId: string, refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: any;
            firstName: any;
            lastName: any;
            email: any;
            role: any;
        };
    }>;
    logout(refreshToken: string): Promise<void>;
    private hashToken;
}
