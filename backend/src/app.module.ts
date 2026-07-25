import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';

// Configuration
import databaseConfig from './config/database.config.js';
import jwtConfig from './config/jwt.config.js';

// Guards, Interceptors & Filters
import { JwtAuthGuard } from './common/guards/jwt-auth.guard.js';
import { TransformInterceptor } from './common/interceptors/transform.interceptor.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';

// Modules
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { AuditModule } from './audit/audit.module.js';
import { ProductsModule } from './products/products.module.js';
import { OrdersModule } from './orders/orders.module.js';
import { ShippingModule } from './shipping/shipping.module.js';
import { CmsModule } from './cms/cms.module.js';
import { MediaModule } from './media/media.module.js';
import { ContactModule } from './contact/contact.module.js';
import { QuizModule } from './quiz/quiz.module.js';
import { MarketingModule } from './marketing/marketing.module.js';
import { AnalyticsModule } from './analytics/analytics.module.js';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [databaseConfig, jwtConfig],
    }),

    // Database Connection
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('database.url'),
        autoLoadEntities: true,
        synchronize: true, // Automatically sync entities with database for development
        logging: false,
      }),
    }),

    // Rate Limiting (100 requests per 1 minute)
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),

    // Application Modules
    AuthModule,
    UsersModule,
    AuditModule,
    ProductsModule,
    OrdersModule,
    ShippingModule,
    CmsModule,
    MediaModule,
    ContactModule,
    QuizModule,
    MarketingModule,
    AnalyticsModule,
  ],
  providers: [
    // Enable Global JWT authentication guard
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // Rate limiter guard
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // Standard response transformer
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    // HttpException handler filter
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
