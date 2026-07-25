import { IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateNotificationPreferenceDto {
  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  emailOrders?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  emailPromos?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  smsOrders?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  smsPromos?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  pushEnabled?: boolean;
}
