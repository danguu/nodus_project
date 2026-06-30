import { IsString, IsOptional } from 'class-validator';

export class TransitionCaseDto {
  @IsString()
  @IsOptional()
  notes?: string;
}
