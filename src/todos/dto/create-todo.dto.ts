import { IsOptional, IsString, IsDateString, IsInt, IsEnum, Min, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Status, Priority, Type } from '../../common/enums';
import { IsFutureDate } from '../../common/decorators';

export class CreateTodoDto {
  @ApiProperty({ description: 'Task title', required: false, maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  task?: string;

  @ApiProperty({ description: 'Comma-separated assignees', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  developer?: string;

  @ApiProperty({ 
    description: 'Due date (must be today or future date)', 
    required: false, 
    type: String, 
    format: 'date',
    example: '2025-09-24'
  })
  @IsOptional()
  @IsDateString()
  @IsFutureDate({ 
    message: 'Due date cannot be in the past. Please choose today or a future date.',
    allowToday: true 
  })
  due_date?: string;

  @ApiProperty({ description: 'Time tracked in minutes', required: false, minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  time_tracked?: number;

  @ApiProperty({ enum: Status, description: 'Task status', required: false })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @ApiProperty({ enum: Priority, description: 'Task priority', required: false })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @ApiProperty({ enum: Type, description: 'Task type', required: false })
  @IsOptional()
  @IsEnum(Type)
  type?: Type;

  @ApiProperty({ description: 'Estimated story points', required: false, minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  estimated_sp?: number;

  @ApiProperty({ description: 'Actual story points', required: false, minimum: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  actual_sp?: number;
}