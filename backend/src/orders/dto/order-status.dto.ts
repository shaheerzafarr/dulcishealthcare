import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class OrderStatusDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  status: string; // confirmed, processing, packed, shipped, out_for_delivery, delivered, cancelled

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  note?: string;
}
