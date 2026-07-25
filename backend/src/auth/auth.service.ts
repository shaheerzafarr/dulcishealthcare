import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service.js';
import { RefreshToken } from './entities/refresh-token.entity.js';
import { User } from '../users/entities/user.entity.js';

@Injectable()
export class AuthService {
  constructor(
    public usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(RefreshToken)
    private tokenRepository: Repository<RefreshToken>,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
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

  async login(user: any) {
    const payload = { 
      email: user.email, 
      sub: user.id, 
      role: user.role?.name || 'customer' 
    };

    const accessToken = this.jwtService.sign(payload);
    
    // Generate refresh token
    const refreshTokenSecret = this.configService.get<string>('jwt.refreshSecret');
    const refreshTokenExpiresIn = this.configService.get<string>('jwt.refreshExpiresIn');
    
    const refreshToken = this.jwtService.sign(payload, {
      secret: refreshTokenSecret,
      expiresIn: refreshTokenExpiresIn as any,
    });

    // Save refresh token hash in DB
    const tokenHash = this.hashToken(refreshToken);
    const decoded = this.jwtService.decode(refreshToken) as any;
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

  async refresh(userId: string, refreshToken: string) {
    const tokenHash = this.hashToken(refreshToken);
    const savedToken = await this.tokenRepository.findOne({
      where: { userId, tokenHash, isRevoked: false },
      relations: { user: { role: true } },
    });

    if (!savedToken || savedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Revoke current refresh token (implementing token rotation)
    savedToken.isRevoked = true;
    await this.tokenRepository.save(savedToken);

    // Login user again to generate new pair
    return this.login(savedToken.user);
  }

  async logout(refreshToken: string) {
    if (!refreshToken) return;
    const tokenHash = this.hashToken(refreshToken);
    const savedToken = await this.tokenRepository.findOne({ where: { tokenHash } });
    if (savedToken) {
      savedToken.isRevoked = true;
      await this.tokenRepository.save(savedToken);
    }
  }

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}
