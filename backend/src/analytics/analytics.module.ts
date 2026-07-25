import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { VisitorSession } from './entities/visitor-session.entity.js';
import { UtmTracking } from './entities/utm-tracking.entity.js';
import { PixelEvent } from './entities/pixel-event.entity.js';
import { AnalyticsService } from './analytics.service.js';
import { AnalyticsController } from './analytics.controller.js';
import { CmsModule } from '../cms/cms.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VisitorSession,
      UtmTracking,
      PixelEvent,
    ]),
    CmsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: configService.get<any>('jwt.expiresIn'),
        },
      }),
    }),
  ],
  providers: [AnalyticsService],
  controllers: [AnalyticsController],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
