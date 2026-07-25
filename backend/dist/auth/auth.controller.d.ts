import { AuthService } from './auth.service.js';
import { CreateUserDto } from '../users/dto/create-user.dto.js';
import { LoginDto } from './dto/login.dto.js';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(createUserDto: CreateUserDto): Promise<import("../users/entities/user.entity.js").User>;
    login(loginDto: LoginDto): Promise<{
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
    refresh(req: any): Promise<{
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
    logout(req: any): Promise<void>;
}
