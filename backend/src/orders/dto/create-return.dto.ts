import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReturnDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  reason: string; // 'damaged', 'wrong_item', 'not_as_described', 'changed_mind'

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;
}
