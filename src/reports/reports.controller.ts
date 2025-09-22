import { Controller, Get, Query, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { Response } from 'express';
import { ReportsService } from './reports.service';
import { ExportQueryDto } from './dto/export-query.dto';

@ApiTags('Reports')
@Controller('reports/todo-lists')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('export')
  @ApiOperation({ summary: 'Export TodoLists to Excel with filtering support' })
  @ApiResponse({ status: 200, description: 'Excel file generated successfully' })
  @ApiResponse({ status: 422, description: 'Validation failed' })
  @ApiResponse({ status: 500, description: 'An error occurred while generating the report' })
  async exportExcel(@Query() query: ExportQueryDto, @Res() res: Response) {
    try {
      const buffer = await this.reportsService.exportExcel(query);
      
      // Generate filename with timestamp
      const filename = `todolist_report_${new Date().toISOString().replace(/[:.]/g, '_').split('T')[0]}_${new Date().toTimeString().slice(0, 8).replace(/:/g, '_')}.xlsx`;
      
      res.set({
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.length,
      });
      
      res.send(buffer);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'An error occurred while generating the report',
        error: error.message,
      });
    }
  }

  @Get('preview')
  @ApiOperation({ summary: 'Get export preview data (for testing/preview purposes)' })
  @ApiResponse({ status: 200, description: 'Preview data retrieved successfully' })
  @ApiResponse({ status: 422, description: 'Validation failed' })
  @ApiResponse({ status: 500, description: 'An error occurred while retrieving preview data' })
  previewData(@Query() query: ExportQueryDto) {
    return this.reportsService.previewData(query);
  }
}