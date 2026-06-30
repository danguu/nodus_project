import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCaseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  area: string;

  @ApiProperty()
  @IsEnum(['ALTA', 'MEDIA', 'BAJA'])
  urgency: string;

  @ApiProperty()
  @IsEnum(['CRITICO', 'ALTO', 'MEDIO', 'BAJO'])
  impact: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  complexity?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  companyId?: string;
}
