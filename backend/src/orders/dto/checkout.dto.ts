import { IsString, IsNotEmpty, IsOptional, IsUUID, IsBoolean, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CheckoutDto {
  // Shipping Address details
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  shippingName: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  shippingPhone?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  shippingLine1: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  shippingLine2?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  shippingCity: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  shippingState?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  shippingPostal: string;

  @ApiPropertyOptional({ default: 'Pakistan' })
  @IsString()
  @IsOptional()
  shippingCountry?: string = 'Pakistan';

  // Billing Address details
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  billingName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  billingLine1?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  billingCity?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  billingState?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  billingPostal?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  billingCountry?: string;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  billingSameAsShipping?: boolean = true;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  shippingRateId: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  couponCode?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ default: 'cod' })
  @IsString()
  @IsNotEmpty()
  paymentMethod: string; // 'cod', 'card', 'jazzcash', 'easypaisa'
}
