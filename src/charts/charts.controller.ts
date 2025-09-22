import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ChartsService } from './charts.service';
import { ChartQueryDto, ChartType } from './dto/chart-query.dto';

@ApiTags('Charts')
@Controller('chart')
export class ChartsController {
  constructor(private readonly chartsService: ChartsService) {}

  @Get()
  @ApiOperation({ summary: 'Get chart summary data based on type parameter' })
  @ApiQuery({ name: 'type', enum: ChartType, description: 'Type of chart data to retrieve' })
  @ApiResponse({ status: 200, description: 'Chart data retrieved successfully' })
  @ApiResponse({ status: 400, description: 'Invalid chart type' })
  @ApiResponse({ status: 422, description: 'Validation failed' })
  @ApiResponse({ status: 500, description: 'An error occurred while generating chart data' })
  getChart(@Query() query: ChartQueryDto) {
    return this.chartsService.getChartData(query.type);
  }
}