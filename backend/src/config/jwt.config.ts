import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'super-secret-access-token-key-2026-dulcis',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'super-secret-refresh-token-key-2026-dulcis',
  expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
}));
