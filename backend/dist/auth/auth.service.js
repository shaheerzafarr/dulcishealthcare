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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const crypto = __importStar(require("crypto"));
const users_service_js_1 = require("../users/users.service.js");
const refresh_token_entity_js_1 = require("./entities/refresh-token.entity.js");
let AuthService = class AuthService {
    usersService;
    jwtService;
    configService;
    tokenRepository;
    constructor(usersService, jwtService, configService, tokenRepository) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.tokenRepository = tokenRepository;
    }
    async validateUser(email, pass) {
        const user = await this.usersService.findByEmail(email, true);
        if (user && user.isActive) {
            const isMatch = await bcrypt.compare(pass, user.passwordHash);
            if (isMatch) {
                const { passwordHash, ...result } = user;
                return result;
            }
        }
        return null;
    }
    async login(user) {
        const payload = {
            email: user.email,
            sub: user.id,
            role: user.role?.name || 'customer'
        };
        const accessToken = this.jwtService.sign(payload);
        const refreshTokenSecret = this.configService.get('jwt.refreshSecret');
        const refreshTokenExpiresIn = this.configService.get('jwt.refreshExpiresIn');
        const refreshToken = this.jwtService.sign(payload, {
            secret: refreshTokenSecret,
            expiresIn: refreshTokenExpiresIn,
        });
        const tokenHash = this.hashToken(refreshToken);
        const decoded = this.jwtService.decode(refreshToken);
        const expiresAt = new Date(decoded.exp * 1000);
        const tokenEntry = this.tokenRepository.create({
            userId: user.id,
            tokenHash,
            expiresAt,
        });
        await this.tokenRepository.save(tokenEntry);
        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role?.name || 'customer',
            },
        };
    }
    async refresh(userId, refreshToken) {
        const tokenHash = this.hashToken(refreshToken);
        const savedToken = await this.tokenRepository.findOne({
            where: { userId, tokenHash, isRevoked: false },
            relations: { user: { role: true } },
        });
        if (!savedToken || savedToken.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
        savedToken.isRevoked = true;
        await this.tokenRepository.save(savedToken);
        return this.login(savedToken.user);
    }
    async logout(refreshToken) {
        if (!refreshToken)
            return;
        const tokenHash = this.hashToken(refreshToken);
        const savedToken = await this.tokenRepository.findOne({ where: { tokenHash } });
        if (savedToken) {
            savedToken.isRevoked = true;
            await this.tokenRepository.save(savedToken);
        }
    }
    hashToken(token) {
        return crypto.createHash('sha256').update(token).digest('hex');
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, typeorm_1.InjectRepository)(refresh_token_entity_js_1.RefreshToken)),
    __metadata("design:paramtypes", [users_service_js_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService,
        typeorm_2.Repository])
], AuthService);
//# sourceMappingURL=auth.service.js.map