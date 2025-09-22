import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ChartType {
  STATUS = 'status',
  PRIORITY = 'priority',
  ASSIGNEE = 'assignee',
}

export class ChartQueryDto {
  @ApiProperty({ enum: ChartType, description: 'Type of chart data to retrieve' })
  @IsEnum(ChartType, { message: 'Type must be one of: status, priority, assignee' })
  type: ChartType;
}