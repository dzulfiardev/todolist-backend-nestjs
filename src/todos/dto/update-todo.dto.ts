import { PartialType } from '@nestjs/mapped-types';
import { CreateTodoDto } from './create-todo.dto';
import { IsOptional, IsString, IsDateString, IsInt, IsEnum, Min, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Status, Priority, Type } from '../../common/enums';

export class UpdateTodoDto {
  @ApiProperty({ description: 'Task title', required: false, maxLength: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  task?: string;

  @ApiProperty({ description: 'Assignees (array or comma-separated string)', required: false })
  @IsOptional()
  developer?: string | string[];

  @ApiProperty({ description: 'Due date', required: false, type: String, format: 'date' })
  @IsOptional()
  @IsDateString()
  date?: string;

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