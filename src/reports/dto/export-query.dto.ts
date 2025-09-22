import { IsOptional, IsString, IsDateString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ExportQueryDto {
  @ApiProperty({ description: 'Filter by title', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'Filter by assignees (comma-separated)', required: false })
  @IsOptional()
  @IsString()
  assigne?: string;

  @ApiProperty({ description: 'Start date for filtering', required: false })
  @IsOptional()
  @IsDateString()
  start?: string;

  @ApiProperty({ description: 'End date for filtering', required: false })
  @IsOptional()
  @IsDateString()
  end?: string;

  @ApiProperty({ description: 'Minimum time tracked', required: false })
  @IsOptional()
  @IsNumber()
  min?: number;

  @ApiProperty({ description: 'Maximum time tracked', required: false })
  @IsOptional()
  @IsNumber()
  max?: number;

  @ApiProperty({ description: 'Filter by status (comma-separated)', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ description: 'Filter by priority (comma-separated)', required: false })
  @IsOptional()
  @IsString()
  priority?: string;
}