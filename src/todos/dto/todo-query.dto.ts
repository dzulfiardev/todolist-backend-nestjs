import { IsOptional, IsString, IsEnum, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TodoQueryDto {
  @ApiProperty({ description: 'Search term', required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ description: 'Sort field', required: false })
  @IsOptional()
  @IsIn(['id', 'title', 'due_date', 'status', 'priority', 'type', 'estimated_sp', 'actual_sp'])
  sort_by?: string;

  @ApiProperty({ description: 'Sort direction', required: false, enum: ['asc', 'desc'] })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  order_direction?: 'asc' | 'desc';
}